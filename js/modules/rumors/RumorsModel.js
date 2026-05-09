import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: "Pueblo Viejo", en: "Old Town" };
        this.defaultNpcName = { es: "Desconocido", en: "Unknown" };
        this.defaultNpcRole = { es: "Viajero", en: "Traveler" };

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas que",
                    "Hay rumores de que",
                    "Nadie confía del todo en esto, pero dicen que",
                    "En la taberna se susurra que",
                    "Se comenta por las calles que",
                    "Los ancianos cuentan que",
                    "Un guardia asegura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (el misterioso {npcRole})",
                    "el infame {npcRole} conocido como {npcName}",
                    "{npcName}, quien trabaja como {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros a medianoche",
                    "sabe dónde está el tesoro perdido, pero tiene demasiado miedo para hablar",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y que en realidad es un espía",
                    "está fabricando venenos para un asesino a sueldo",
                    "hizo un pacto con un demonio de encrucijada",
                    "es el heredero perdido de una nobleza caída en desgracia",
                    "fue visto desvaneciéndose en las sombras",
                    "bebió sangre de un cáliz profano",
                    "tiró algo brillando"
                ],
                locations: [
                    "cerca de {townName}.",
                    "en los callejones de {townName}.",
                    "en el cementerio de {townName}.",
                    "a las afueras de {townName}.",
                    "bajo las alcantarillas de {townName}.",
                    "en la plaza mayor de {townName}."
                ],
                hooks: [
                    "El PNJ tiene un mapa cosido dentro de su abrigo.",
                    "Si los jugadores lo confrontan, el PNJ huirá hacia un escondite cercano.",
                    "El PNJ está bajo el control mental de un ilícido.",
                    "Los jugadores encuentran un rastro de sangre que lleva a su casa.",
                    "El PNJ ofrece una gran suma de oro a los jugadores para que guarden silencio.",
                    "Todo es un malentendido, el PNJ en realidad está protegiendo a un huérfano.",
                    "El PNJ tiene un amuleto mágico que le permite cambiar de forma.",
                    "Un gremio de ladrones está buscando al PNJ por una deuda impaga."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "Some whisper that",
                    "Rumor has it that",
                    "There are tales saying",
                    "No one fully trusts it, but they say",
                    "In the tavern, people whisper that",
                    "It's widely commented that",
                    "The elders claim that",
                    "A guard swears that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (the mysterious {npcRole})",
                    "the infamous {npcRole} known as {npcName}",
                    "{npcName}, who works as a {npcRole},"
                ],
                actions: [
                    "was seen making shady deals at midnight",
                    "knows where the lost treasure is, but is too afraid to speak",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is actually a spy",
                    "is brewing poisons for a hired assassin",
                    "made a pact with a crossroads demon",
                    "is the lost heir of a disgraced nobility",
                    "was seen vanishing into the shadows",
                    "drank blood from a profane chalice",
                    "threw something glowing"
                ],
                locations: [
                    "near {townName}.",
                    "in the alleys of {townName}.",
                    "in the graveyard of {townName}.",
                    "just outside {townName}.",
                    "in the sewers beneath {townName}.",
                    "in the main square of {townName}."
                ],
                hooks: [
                    "The NPC has a map sewn inside their coat.",
                    "If confronted, the NPC will flee to a nearby hideout.",
                    "The NPC is under the mind control of an illithid.",
                    "The players find a trail of blood leading to their house.",
                    "The NPC offers the players a large sum of gold to keep quiet.",
                    "It's all a misunderstanding; the NPC is actually protecting an orphan.",
                    "The NPC has a magical amulet that allows shapeshifting.",
                    "A thieves' guild is hunting the NPC for an unpaid debt."
                ]
            }
        };
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';

        const town = townName || this.defaultTown[lang];
        const name = npcName || this.defaultNpcName[lang];
        const role = npcRole || this.defaultNpcRole[lang];

        if (AIService.isConfigured()) {
            const systemPrompt = `Eres un experto Dungeon Master para juegos de rol de mesa. Genera un rumor o chisme intrigante sobre un PNJ en una ciudad de fantasía, y también proporciona un breve "Gancho de Aventura" (DM Notes) basado en ese rumor.
            El idioma de la respuesta DEBE ser: ${lang === 'es' ? 'Español' : 'Inglés'}.
            Formatea tu respuesta exactamente en JSON con este esquema: {"rumor": "texto del rumor", "hook": "texto del gancho"}`;

            const userPrompt = `Ciudad/Pueblo: ${town}\nPNJ: ${name}\nRol del PNJ: ${role}`;

            const aiResponse = await AIService.generate(systemPrompt, userPrompt);
            if (aiResponse) {
                try {
                    // Extract JSON if wrapped in markdown
                    let jsonText = aiResponse;
                    if (jsonText.startsWith('\`\`\`json')) {
                        jsonText = jsonText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
                    }
                    const parsed = JSON.parse(jsonText);
                    if (parsed.rumor && parsed.hook) {
                        return parsed;
                    }
                } catch (e) {
                    console.error("RumorsModel: Failed to parse AI response", e);
                }
            }
        }

        // Fallback procedural generation
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
