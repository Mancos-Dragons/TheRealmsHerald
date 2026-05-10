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
                    "Se dice en {townName} que",
                    "Un mercader que pasó por {townName} mencionó que",
                    "Dicen las malas lenguas de {townName} que",
                    "Anoche hubo ruidos extraños en {townName}. Creen que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro {npcRole}, {npcName},",
                    "el misterioso {npcRole} llamado {npcName}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido, pero tiene demasiado miedo para hablar",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y que en realidad es un espía"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las sombras durante la ronda de guardia.",
                    "en las afueras de la ciudad."
                ],
                hooks: [
                    "Los jugadores pueden seguir el rastro y encontrar un alijo oculto de contrabando.",
                    "Una facción rival podría ofrecer una recompensa por más información.",
                    "El comportamiento extraño es en realidad una tapadera para proteger a un inocente.",
                    "El rumor es completamente falso, plantado por alguien que intenta incriminarlo."
                ]
            },
            en: {
                intros: [
                    "It's said in {townName} that",
                    "A merchant passing through {townName} mentioned that",
                    "Rumor has it in {townName} that",
                    "There were strange noises in {townName} last night. They think that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our {npcRole}, {npcName},",
                    "the mysterious {npcRole} named {npcName}"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a lost treasure is, but is too afraid to speak",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is actually a spy"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old graveyard.",
                    "in the shadows during the guard patrol.",
                    "on the outskirts of town."
                ],
                hooks: [
                    "Players can follow the trail and find a hidden cache of smuggled goods.",
                    "A rival faction might offer a reward for more information.",
                    "The strange behavior is actually a cover to protect an innocent.",
                    "The rumor is completely false, planted by someone trying to frame them."
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
                    if (jsonText.startsWith('```json')) {
                        jsonText = jsonText.replace(/^```json/m, '').replace(/```$/m, '').trim();
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

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = pickRandom(grammar.intros);
        let subject = pickRandom(grammar.subjects);
        let action = pickRandom(grammar.actions);
        let location = pickRandom(grammar.locations);
        let hook = pickRandom(grammar.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hook
        };
    }
}
