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
                    "Se comenta en la taberna que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "el misterioso {npcRole} llamado {npcName},",
                    "aquel {npcRole} conocido como {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "escondió un tesoro robado",
                    "hizo un pacto con un demonio",
                    "está fabricando venenos peligrosos",
                    "fue visto desenterrando tumbas"
                ],
                locations: [
                    "cerca del bosque de {townName}.",
                    "en las sombras de {townName}.",
                    "a las afueras de {townName}.",
                    "en el viejo cementerio de {townName}.",
                    "en las alcantarillas de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado.",
                    "Gancho de Aventura: Una extraña plaga sigue a los pasos del PNJ."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it that",
                    "There are murmurs that",
                    "It is commented in the tavern that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "the mysterious {npcRole} named {npcName},",
                    "that {npcRole} known as {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "hid a stolen treasure",
                    "made a pact with a demon",
                    "is brewing dangerous poisons",
                    "was seen digging up graves"
                ],
                locations: [
                    "near the forest of {townName}.",
                    "in the shadows of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the old cemetery of {townName}.",
                    "in the sewers of {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions.",
                    "Plot Hook: A strange plague follows in the NPC's footsteps."
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

        const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomElement(grammar.intros);
        const subject = randomElement(grammar.subjects);
        const action = randomElement(grammar.actions);
        const location = randomElement(grammar.locations);
        const hookText = randomElement(grammar.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
