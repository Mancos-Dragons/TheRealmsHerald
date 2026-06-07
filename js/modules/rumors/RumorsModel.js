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
                    "Nadie confía en que"
                ],
                subjects: [
                    "{npcName}, el {npcRole}",
                    "el misterioso {npcRole} llamado {npcName}",
                    "aquel {npcRole} de nombre {npcName}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "está fabricando venenos"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en las catacumbas debajo de {townName}.",
                    "a las afueras de {townName}.",
                    "en el cementerio de {townName}.",
                    "en los rincones más oscuros de {townName}."
                ],
                hooks: [
                    "El PNJ ofrece una recompensa a quien le consiga un artefacto raro.",
                    "El PNJ está siendo chantajeado y busca ayuda discretamente.",
                    "El PNJ planea abandonar la ciudad esta noche y alguien quiere detenerlo.",
                    "La guardia local sospecha del PNJ y pide a los jugadores que lo investiguen.",
                    "El PNJ tiene un mapa cosido en el forro de su abrigo."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it that",
                    "There are rumors that",
                    "Nobody trusts that"
                ],
                subjects: [
                    "{npcName}, the {npcRole}",
                    "the mysterious {npcRole} named {npcName}",
                    "that {npcRole} by the name of {npcName}"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is a spy",
                    "is crafting poisons"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the catacombs beneath {townName}.",
                    "on the outskirts of {townName}.",
                    "in the cemetery of {townName}.",
                    "in the darkest corners of {townName}."
                ],
                hooks: [
                    "The NPC is offering a reward to anyone who can fetch a rare artifact.",
                    "The NPC is being blackmailed and is quietly looking for help.",
                    "The NPC is planning to leave town tonight and someone wants to stop them.",
                    "The local guard suspects the NPC and asks the players to investigate.",
                    "The NPC has a map sewn into the lining of their coat."
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

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
