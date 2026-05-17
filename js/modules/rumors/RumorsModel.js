import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';


export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: 'Aldea Olvidada', en: 'Forgotten Hamlet' };
        this.defaultNpcName = { es: 'Un Extraño', en: 'A Stranger' };
        this.defaultNpcRole = { es: 'Viajero', en: 'Traveler' };

        this.grammar = {
            es: {
                intros: [
                    "Se dice en las calles que",
                    "Un pajarito me contó que",
                    "Escuché en la taberna que",
                    "Es un secreto a voces que",
                    "No lo cuentes por ahí, pero dicen que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "el {npcRole} conocido como {npcName},",
                    "aquel {npcRole} llamado {npcName},"
                ],
                actions: [
                    "está escondiendo un tesoro robado",
                    "hizo un pacto con un demonio",
                    "es en realidad un espía de otro reino",
                    "fue visto huyendo de la escena de un crimen",
                    "está planeando un asesinato"
                ],
                locations: [
                    "cerca de las afueras de {townName}.",
                    "en los callejones de {townName}.",
                    "en las catacumbas bajo {townName}.",
                    "justo en el centro de {townName}.",
                    "en las ruinas cerca de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán pistas que confirman el rumor.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene la verdad.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos y el PNJ necesita ayuda para salir de un gran aprieto.",
                    "Gancho de Aventura: Al investigar, los jugadores descubren una conspiración mucho mayor."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "A little bird told me that",
                    "I heard at the tavern that",
                    "It is an open secret that",
                    "Don't spread it around, but they say that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "the {npcRole} known as {npcName},",
                    "that {npcRole} named {npcName},"
                ],
                actions: [
                    "is hiding a stolen treasure",
                    "made a pact with a demon",
                    "is actually a spy from another realm",
                    "was seen fleeing a crime scene",
                    "is plotting an assassination"
                ],
                locations: [
                    "near the outskirts of {townName}.",
                    "in the alleys of {townName}.",
                    "in the catacombs beneath {townName}.",
                    "right in the center of {townName}.",
                    "in the ruins near {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find clues that confirm the rumor.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains the truth.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation.",
                    "Plot Hook: The rumors are true and the NPC needs help to get out of a huge mess.",
                    "Plot Hook: Upon investigating, the players discover a much larger conspiracy."
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

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomEl(grammar.intros)} ${randomEl(grammar.subjects)} ${randomEl(grammar.actions)} ${randomEl(grammar.locations)}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomEl(grammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
}
}
