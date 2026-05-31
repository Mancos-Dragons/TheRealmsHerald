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
                    "Se dice por ahí que",
                    "Un pajarito me contó que",
                    "Las malas lenguas aseguran que",
                    "Escuché en la taberna que",
                    "Hay un rumor fuerte de que"
                ],
                subjects: [
                    "{npcName}, nuestro querido {npcRole},",
                    "ese extraño {npcRole} llamado {npcName},",
                    "{npcName} (el {npcRole} local),",
                    "el infame {npcName}, el {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "encontró un artefacto antiguo",
                    "está invocando fuerzas oscuras",
                    "esconde un oscuro secreto",
                    "está planeando una rebelión"
                ],
                locations: [
                    "en las afueras de {townName}.",
                    "cerca del cementerio de {townName}.",
                    "bajo el puente principal de {townName}.",
                    "en los sótanos de {townName}.",
                    "en los bosques oscuros de {townName}."
                ],
                hooks: [
                    "El grupo podría investigar las ruinas cercanas para encontrar pruebas.",
                    "El PNJ puede pedir ayuda al grupo de forma desesperada, pagando con oro antiguo.",
                    "Los guardias están buscando voluntarios para interrogar al PNJ.",
                    "Un culto local podría estar involucrado y tratar de silenciar a quien indague demasiado.",
                    "El PNJ tiene un mapa que lleva a una mazmorra oculta, pero le falta la otra mitad."
                ]
            },
            en: {
                intros: [
                    "Word around here is that",
                    "A little bird told me that",
                    "Rumor has it that",
                    "I heard at the tavern that",
                    "There's a strong rumor that"
                ],
                subjects: [
                    "{npcName}, our beloved {npcRole},",
                    "that strange {npcRole} named {npcName},",
                    "{npcName} (the local {npcRole}),",
                    "the infamous {npcName}, the {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "found an ancient artifact",
                    "is summoning dark forces",
                    "hides a dark secret",
                    "is planning a rebellion"
                ],
                locations: [
                    "on the outskirts of {townName}.",
                    "near the cemetery of {townName}.",
                    "under the main bridge of {townName}.",
                    "in the cellars of {townName}.",
                    "in the dark woods of {townName}."
                ],
                hooks: [
                    "The party might investigate the nearby ruins to find proof.",
                    "The NPC may desperately ask the party for help, paying with ancient gold.",
                    "Guards are looking for volunteers to interrogate the NPC.",
                    "A local cult might be involved and try to silence anyone who digs too deep.",
                    "The NPC holds a map leading to a hidden dungeon, but is missing the other half."
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
            rumor: rumorText.trim(),
            hook: hookText
        };
    }
}
