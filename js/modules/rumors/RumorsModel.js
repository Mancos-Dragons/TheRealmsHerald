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
                    "Nadie confía cuando se menciona que",
                    "Los niños del lugar dicen que",
                    "Un guardia asegura que",
                    "En la taberna se susurra que",
                    "Se comenta en el mercado que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "el infame {npcRole} conocido como {npcName} en {townName},",
                    "{npcName}, quien ejerce de {npcRole} cerca de {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser",
                    "desenterró algo en el viejo cementerio",
                    "hizo un pacto con un demonio de encrucijada",
                    "habla con los árboles",
                    "colecciona almas en frascos de cristal",
                    "fue visto bebiendo sangre"
                ],
                details: [
                    "a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "y por eso los cuervos no paran de graznar.",
                    "en las sombras.",
                    "cerca del bosque viejo.",
                    "y todos fingen no darse cuenta.",
                    "para un asesino a sueldo.",
                    "cuando no hay nadie mirando.",
                    "desde el solsticio de invierno."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "Rumor has it that",
                    "There are rumors that",
                    "Word around is that",
                    "The children say that",
                    "A guard swears that",
                    "In the tavern it's whispered that",
                    "It's discussed in the market that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "the infamous {npcRole} known as {npcName} in {townName},",
                    "{npcName}, who works as a {npcRole} near {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be",
                    "was seen digging something up in the old graveyard",
                    "made a pact with a crossroad demon",
                    "talks to the trees",
                    "collects souls in glass jars",
                    "was seen drinking blood"
                ],
                details: [
                    "at midnight.",
                    "but is too afraid to speak.",
                    "and that's why the crows haven't stopped cawing.",
                    "in the shadows.",
                    "near the old forest.",
                    "and everyone pretends not to notice.",
                    "for a hired assassin.",
                    "when nobody is looking.",
                    "since the winter solstice."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap."
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
        const grammar = this.grammar[lang] || this.grammar['es'];

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const detail = grammar.details[Math.floor(Math.random() * grammar.details.length)];
        const hook = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${detail}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hook
        };
    }
}
