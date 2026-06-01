import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: 'Villa Sombría', en: 'Shadowy Village' };
        this.defaultNpcName = { es: 'Alaric', en: 'Alaric' };
        this.defaultNpcRole = { es: 'el herrero', en: 'the blacksmith' };

        this.grammar = {
            es: {
                intros: [
                    "Se dice en las calles que",
                    "Me han contado en la taberna que",
                    "Es un secreto a voces que",
                    "Escuché por ahí que"
                ],
                subjects: [
                    "{npcName}, {npcRole}",
                    "el infame {npcRole}, {npcName}",
                    "el misterioso {npcName}, {npcRole}"
                ],
                actions: [
                    "fue visto desenterrando tumbas",
                    "estaba haciendo tratos con cultistas",
                    "oculta un tesoro oscuro",
                    "está planeando una revuelta"
                ],
                locations: [
                    "en las afueras de {townName}.",
                    "debajo del antiguo templo de {townName}.",
                    "en el bosque cercano a {townName}.",
                    "justo en el centro de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna.",
                    "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado por un gremio de ladrones.",
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: Una extraña plaga sigue a los pasos del PNJ; los aventureros deben encontrar una cura mítica."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "I heard in the tavern that",
                    "It's an open secret that",
                    "I heard around that"
                ],
                subjects: [
                    "{npcName}, {npcRole}",
                    "the infamous {npcRole}, {npcName}",
                    "the mysterious {npcName}, {npcRole}"
                ],
                actions: [
                    "was seen digging up graves",
                    "was making deals with cultists",
                    "hides a dark treasure",
                    "is planning a revolt"
                ],
                locations: [
                    "on the outskirts of {townName}.",
                    "beneath the ancient temple of {townName}.",
                    "in the forest near {townName}.",
                    "right in the center of {townName}."
                ],
                hooks: [
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor in the tavern.",
                    "Plot Hook: The NPC begs the players for help because they are being blackmailed by a thieves guild.",
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: A strange plague follows in the NPC's footsteps; the adventurers must find a mythical cure."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomEl(g.intros)} ${randomEl(g.subjects)} ${randomEl(g.actions)} ${randomEl(g.locations)}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomEl(g.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
