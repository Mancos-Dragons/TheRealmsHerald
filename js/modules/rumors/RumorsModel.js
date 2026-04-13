import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.grammar = {
            es: {
                defaults: {
                    town: "Pueblo Viejo",
                    npcName: "Desconocido",
                    npcRole: "Viajero"
                },
                intros: [
                    "Se dice que ", "Algunos murmuran que ", "Dicen las malas lenguas en {townName} que ",
                    "Se rumorea que ", "En la taberna se susurra que ", "Un guardia asegura que "
                ],
                subjects: [
                    "{npcName}, el {npcRole}, ", "{npcName} ", "nuestro {npcRole}, {npcName}, "
                ],
                actions: [
                    "fue visto haciendo tratos oscuros ", "sabe dónde está el tesoro perdido ",
                    "está invocando fuerzas que no comprende ", "no es quien dice ser ",
                    "desenterró algo extraño ", "está fabricando venenos ", "hizo un pacto con un demonio ",
                    "es en realidad un espía ", "habla con los muertos "
                ],
                locations: [
                    "cerca del bosque viejo.", "en el cementerio.", "a las afueras de {townName}.",
                    "en el sótano de su casa.", "cerca de la encrucijada.", "bajo la luz de la luna."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente si se le presiona, pero su diario contiene pistas.",
                    "Gancho de Aventura: Esto es una trampa tendida por un rival para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos y el PNJ necesita ayuda antes del próximo eclipse.",
                    "Gancho de Aventura: Los jugadores son atacados si preguntan demasiado sobre esto en la taberna."
                ]
            },
            en: {
                defaults: {
                    town: "Old Town",
                    npcName: "Unknown",
                    npcRole: "Traveler"
                },
                intros: [
                    "They say ", "Some whisper that ", "Word around {townName} is that ",
                    "It is rumored that ", "In the tavern it's whispered that ", "A guard swears that "
                ],
                subjects: [
                    "{npcName}, the {npcRole}, ", "{npcName} ", "our {npcRole}, {npcName}, "
                ],
                actions: [
                    "was seen making dark deals ", "knows where the lost treasure is ",
                    "is summoning forces they don't understand ", "is not who they claim to be ",
                    "dug something strange up ", "is crafting poisons ", "made a pact with a demon ",
                    "is actually a spy ", "speaks with the dead "
                ],
                locations: [
                    "near the old forest.", "in the graveyard.", "on the outskirts of {townName}.",
                    "in the basement of their house.", "near the crossroads.", "under the moonlight."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything if pressed, but their diary contains clues.",
                    "Plot Hook: This is a trap set by a rival to ruin their reputation.",
                    "Plot Hook: The rumors are true and the NPC needs help before the next eclipse.",
                    "Plot Hook: The players are attacked if they ask too many questions about this in the tavern."
                ]
            }
        };
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';
        const grammar = this.grammar[lang] || this.grammar['es'];

        const town = townName || grammar.defaults.town;
        const name = npcName || grammar.defaults.npcName;
        const role = npcRole || grammar.defaults.npcRole;

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

        // Procedural generation
        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = rand(grammar.intros) + rand(grammar.subjects) + rand(grammar.actions) + rand(grammar.locations);

        rumorText = rumorText.replace(/{townName}/g, town)
                             .replace(/{npcName}/g, name)
                             .replace(/{npcRole}/g, role);

        let hookText = rand(grammar.hooks);
        hookText = hookText.replace(/{townName}/g, town)
                           .replace(/{npcName}/g, name)
                           .replace(/{npcRole}/g, role);

        return { rumor: rumorText, hook: hookText };
    }
}
