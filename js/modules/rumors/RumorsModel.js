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
                    "Nadie confía en que",
                    "Se rumorea en la calle que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (el {npcRole} de {townName}),",
                    "{npcName}, nuestro {npcRole} de {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y en realidad es un espía",
                    "fue visto desenterrando algo",
                    "hizo un pacto con un demonio",
                    "colecciona almas en frascos de cristal"
                ],
                details: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "en el viejo cementerio.",
                    "cerca de la encrucijada.",
                    "en su sótano oscuro."
                ],
                hooks: [
                    "El grupo encuentra un mapa a medio quemar cerca del lugar de los hechos.",
                    "El PNJ ofrece una recompensa si mantienen su secreto a salvo.",
                    "Al investigar, los jugadores descubren que el PNJ está siendo chantajeado.",
                    "Una secta local está buscando al PNJ para un ritual inminente.",
                    "El PNJ desaparece a la mañana siguiente, dejando un rastro de sangre."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumors in the streets say that",
                    "Nobody trusts that",
                    "Word on the street is that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} (the local {npcRole} of {townName}),",
                    "{npcName}, our {npcRole} of {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is actually a spy",
                    "was seen digging something up",
                    "made a pact with a demon",
                    "collects souls in glass jars"
                ],
                details: [
                    "near the old forest at midnight.",
                    "but is too afraid to speak.",
                    "in the old graveyard.",
                    "near the crossroads.",
                    "in their dark basement."
                ],
                hooks: [
                    "The party finds a half-burned map near the scene.",
                    "The NPC offers a reward if they keep their secret safe.",
                    "Upon investigating, the players discover the NPC is being blackmailed.",
                    "A local cult is hunting the NPC for an impending ritual.",
                    "The NPC disappears the next morning, leaving a trail of blood."
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
            const systemPrompt = `Eres un experto Dungeon Master para juegos de rol de mesa. Genera un rumor o chisme intrigante sobre un PNJ en una ciudad de fantasía, y también proporciona un breve "Gancho de Aventura" (DM Notes) basado en ese rumor.\nEl idioma de la respuesta DEBE ser: ${lang === 'es' ? 'Español' : 'Inglés'}.\nFormatea tu respuesta exactamente en JSON con este esquema: {"rumor": "texto del rumor", "hook": "texto del gancho"}`;

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

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const detail = g.details[Math.floor(Math.random() * g.details.length)];
        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${detail}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText.trim(),
            hook: hookText
        };
    }
}
