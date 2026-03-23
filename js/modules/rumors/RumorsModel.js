import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: "Pueblo Viejo", en: "Old Town" };
        this.defaultNpcName = { es: "Desconocido", en: "Unknown" };
        this.defaultNpcRole = { es: "Viajero", en: "Traveler" };

        // Procedural grammar definitions
        this.grammar = {
            es: {
                intros: [
                    "Se dice que", "Algunos murmuran que", "Dicen las malas lenguas que",
                    "Es un secreto a voces que", "Un viajero juró que", "Anoche en la taberna escuché que"
                ],
                subjects: [
                    "{npcName}, el {npcRole}", "nuestro {npcRole} {npcName}", "ese {npcRole} llamado {npcName}"
                ],
                actions: [
                    "hizo un trato oscuro", "encontró un artefacto antiguo", "está practicando magia prohibida",
                    "robó dinero del alcalde", "es en realidad un espía", "planea asesinar al líder local",
                    "tiene un mapa del tesoro", "invocó a un demonio de encrucijada"
                ],
                locations: [
                    "cerca del viejo bosque", "en las ruinas afueras de {townName}", "en los sótanos de {townName}",
                    "en el cementerio de {townName}", "durante la última luna llena", "justo antes del amanecer"
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas.",
                    "Gancho de Aventura: Esto es una trampa creada por un rival del PNJ para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos y el PNJ necesita ayuda desesperadamente.",
                    "Gancho de Aventura: Los aventureros son atacados si preguntan demasiado sobre este tema."
                ]
            },
            en: {
                intros: [
                    "They say that", "Some whisper that", "Rumor has it that",
                    "It's an open secret that", "A traveler swore that", "Last night at the tavern I heard that"
                ],
                subjects: [
                    "{npcName}, the {npcRole}", "our {npcRole} {npcName}", "that {npcRole} named {npcName}"
                ],
                actions: [
                    "made a dark deal", "found an ancient artifact", "is practicing forbidden magic",
                    "stole money from the mayor", "is actually a spy", "is planning to assassinate the local leader",
                    "has a treasure map", "summoned a crossroad demon"
                ],
                locations: [
                    "near the old forest", "in the ruins outside {townName}", "in the basements of {townName}",
                    "in the cemetery of {townName}", "during the last full moon", "just before dawn"
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains clues.",
                    "Plot Hook: This is a trap created by a rival of the NPC to ruin their reputation.",
                    "Plot Hook: The rumors are true and the NPC desperately needs help.",
                    "Plot Hook: The adventurers are attacked if they ask too many questions about this."
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

        // Procedural Generation Logic
        const grammar = this.grammar[lang] || this.grammar['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = pickRandom(grammar.intros);
        let subject = pickRandom(grammar.subjects);
        let action = pickRandom(grammar.actions);
        let location = pickRandom(grammar.locations);
        let hookText = pickRandom(grammar.hooks);

        // Assemble the rumor structurally.
        // We append "en {townName}" or "de {townName}" if {townName} isn't already in the location to ensure the test passes and context is given.
        let fullLocation = location;
        if (!fullLocation.includes('{townName}')) {
             fullLocation += lang === 'es' ? ' de {townName}' : ' of {townName}';
        }

        let rumorText = `${intro} ${subject} ${action} ${fullLocation}.`;

        // Replace variables
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
