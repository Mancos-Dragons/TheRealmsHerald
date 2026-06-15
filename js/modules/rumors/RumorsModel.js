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
                    "Se dice que ",
                    "Algunos murmuran que ",
                    "Dicen las malas lenguas que ",
                    "Se rumorea en la taberna que ",
                    "Nadie quiere hablar de ello, pero "
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "ese extraño de {npcName}, nuestro {npcRole},",
                    "el misterioso {npcRole} llamado {npcName},"
                ],
                actions: [
                    " fue visto haciendo tratos oscuros",
                    " sabe dónde está el tesoro escondido",
                    " está invocando fuerzas que no comprende",
                    " guarda un secreto peligroso",
                    " ha hecho un pacto con entidades prohibidas"
                ],
                locations: [
                    " cerca de {townName} a medianoche.",
                    " en las profundidades ocultas de {townName}.",
                    " en las afueras de {townName}.",
                    " bajo las calles de {townName}."
                ],
                hooks: [
                    "Un aventurero podría investigar la zona para encontrar pruebas sobre {npcName}.",
                    "Los guardias de {townName} buscan voluntarios para confirmar el rumor.",
                    "Un rival de {npcName} pagará muy bien en oro por esta información."
                ]
            },
            en: {
                intros: [
                    "It is said that ",
                    "Some whisper that ",
                    "Rumor has it that ",
                    "They say in the tavern that ",
                    "Nobody wants to talk about it, but "
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "that strange {npcName}, our local {npcRole},",
                    "the mysterious {npcRole} named {npcName},"
                ],
                actions: [
                    " was seen making dark deals",
                    " knows where the hidden treasure is",
                    " is summoning forces beyond their control",
                    " keeps a dangerous secret",
                    " has made a pact with forbidden entities"
                ],
                locations: [
                    " near {townName} at midnight.",
                    " deep within the hidden parts of {townName}.",
                    " on the outskirts of {townName}.",
                    " beneath the streets of {townName}."
                ],
                hooks: [
                    "An adventurer could investigate the area to find clues about {npcName}.",
                    "The guards of {townName} are looking for volunteers to confirm the rumor.",
                    "A rival of {npcName} will pay handsomely in gold for this information."
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

        let rumorText = intro + subject + action + location;

        let hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        // Replace placeholders
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
