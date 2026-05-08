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
                    "Se dice en {townName} que",
                    "Un mercader forastero que llegó a {townName} mencionó que",
                    "Las malas lenguas de {townName} susurran que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro querido {npcName} ({npcRole}),",
                    "aquel {npcRole} llamado {npcName},"
                ],
                actions: [
                    "hizo un pacto con entidades oscuras",
                    "descubrió un tesoro escondido",
                    "está conspirando contra el alcalde",
                    "esconde un oscuro secreto de su pasado",
                    "planea robar la reliquia del templo"
                ],
                locations: [
                    "en el cementerio viejo.",
                    "bajo la taberna local.",
                    "en las ruinas del bosque.",
                    "cerca del río abandonado.",
                    "en los callejones de la ciudad."
                ],
                hooks: [
                    "El grupo podría investigar las pistas cerca de {townName} para seguir a {npcName} el {npcRole}.",
                    "Los aventureros podrían querer interrogar a {npcName} ({npcRole}) en {townName} antes de que sea demasiado tarde.",
                    "Sería prudente buscar pistas en {townName} sobre las verdaderas intenciones de {npcName}, el {npcRole}.",
                    "Alguien en {townName} está ofreciendo una recompensa por descubrir la verdad sobre {npcName}, nuestro misterioso {npcRole}.",
                    "Si el grupo vigila de cerca a {npcName}, el {npcRole} de {townName}, podrían descubrir algo perturbador."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "A traveling merchant who arrived in {townName} mentioned that",
                    "The gossips of {townName} whisper that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our dear {npcName} ({npcRole}),",
                    "that {npcRole} named {npcName},"
                ],
                actions: [
                    "made a pact with dark entities",
                    "discovered a hidden treasure",
                    "is plotting against the mayor",
                    "hides a dark secret from their past",
                    "plans to steal the temple's relic"
                ],
                locations: [
                    "in the old graveyard.",
                    "under the local tavern.",
                    "in the forest ruins.",
                    "near the abandoned river.",
                    "in the city alleys."
                ],
                hooks: [
                    "The party could investigate the clues near {townName} to follow {npcName} the {npcRole}.",
                    "Adventurers might want to interrogate {npcName} ({npcRole}) in {townName} before it is too late.",
                    "It would be wise to search for clues in {townName} about the true intentions of {npcName}, the {npcRole}.",
                    "Someone in {townName} is offering a reward for discovering the truth about {npcName}, our mysterious {npcRole}.",
                    "If the party keeps a close eye on {npcName}, the {npcRole} of {townName}, they might discover something disturbing."
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
                    } else if (jsonText.startsWith('\`\`\`')) {
                        jsonText = jsonText.replace(/^\`\`\`/m, '').replace(/\`\`\`$/m, '').trim();
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
        const grammarData = this.grammar[lang] || this.grammar['es'];

        const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomElement(grammarData.intros)} ${randomElement(grammarData.subjects)} ${randomElement(grammarData.actions)} ${randomElement(grammarData.locations)}`;
        let hookText = randomElement(grammarData.hooks);

        rumorText = rumorText.replace(/{townName}/g, town).replace(/{npcName}/g, name).replace(/{npcRole}/g, role);
        hookText = hookText.replace(/{townName}/g, town).replace(/{npcName}/g, name).replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
