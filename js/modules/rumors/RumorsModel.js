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
                    "Anoche hubo ruidos extraños y se cree que",
                    "Dicen las malas lenguas que",
                    "Se rumorea en la taberna que"
                ],
                subjects: [
                    "{npcName}, nuestro {npcRole},",
                    "ese forastero, {npcName} ({npcRole}),",
                    "{npcName}, el {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está fabricando venenos en secreto",
                    "hizo un pacto con un ser del inframundo",
                    "sabe dónde está el tesoro perdido de la ciudad",
                    "está invocando fuerzas que no comprende"
                ],
                locations: [
                    " cerca del bosque viejo a medianoche.",
                    " en las catacumbas debajo de {townName}.",
                    " justo a las afueras de {townName}.",
                    " en un callejón oscuro de {townName}.",
                    "."
                ],
                hooks: [
                    "Los aventureros podrían investigar el lugar mencionado a medianoche para confirmar la historia.",
                    "El PNJ tiene un mapa codificado que alguien dejó caer; si los aventureros lo descifran, encontrarán el tesoro.",
                    "Alguien más está buscando al PNJ para cobrar una deuda de sangre. Los aventureros pueden intervenir o ayudar."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Last night there were strange noises and it's believed that",
                    "Rumor has it that",
                    "They say in the tavern that"
                ],
                subjects: [
                    "{npcName}, our {npcRole},",
                    "that stranger, {npcName} (the {npcRole}),",
                    "{npcName}, the {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is secretly brewing poisons",
                    "made a pact with an underworld being",
                    "knows where the lost city treasure is",
                    "is summoning forces they don't understand"
                ],
                locations: [
                    " near the old forest at midnight.",
                    " in the catacombs beneath {townName}.",
                    " just outside of {townName}.",
                    " in a dark alley of {townName}.",
                    "."
                ],
                hooks: [
                    "The adventurers could investigate the mentioned place at midnight to confirm the story.",
                    "The NPC has a coded map someone dropped; if the adventurers decipher it, they will find the treasure.",
                    "Someone else is looking for the NPC to collect a blood debt. The adventurers can intervene or help."
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

        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let rumorText = `${intro} ${subject} ${action}${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
