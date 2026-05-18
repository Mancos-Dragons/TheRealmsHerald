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
                    "Se dice en las calles que",
                    "Un pajarito me contó que",
                    "Es un secreto a voces que",
                    "Corre el rumor de que"
                ],
                subjects: [
                    "{npcName}, nuestro querido {npcRole},",
                    "{npcName}, el misterioso {npcRole},",
                    "{npcName}, quien trabaja de {npcRole},"
                ],
                actions: [
                    "estuvo desenterrando tumbas",
                    "hizo un pacto con un demonio",
                    "escondió un cofre lleno de oro",
                    "fue visto tramando algo oscuro"
                ],
                locations: [
                    "en las afueras de {townName}.",
                    "debajo de la taberna de {townName}.",
                    "en el cementerio de {townName}.",
                    "cerca del viejo molino de {townName}."
                ],
                hooks: [
                    "Los aventureros podrían investigar el lugar esta noche.",
                    "La guardia local ofrece una recompensa por pruebas.",
                    "Tal vez alguien debería confrontarle discretamente."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "A little bird told me that",
                    "It's an open secret that",
                    "Rumor has it that"
                ],
                subjects: [
                    "{npcName}, our beloved {npcRole},",
                    "{npcName}, the mysterious {npcRole},",
                    "{npcName}, who works as a {npcRole},"
                ],
                actions: [
                    "was digging up graves",
                    "made a pact with a demon",
                    "hid a chest full of gold",
                    "was seen plotting something dark"
                ],
                locations: [
                    "on the outskirts of {townName}.",
                    "under the tavern in {townName}.",
                    "in the graveyard of {townName}.",
                    "near the old mill of {townName}."
                ],
                hooks: [
                    "The adventurers might want to investigate the area tonight.",
                    "The local guard is offering a reward for proof.",
                    "Perhaps someone should confront them discreetly."
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
        const langData = this.grammar[lang] || this.grammar['es'];
        const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomPick(langData.intros)} ${randomPick(langData.subjects)} ${randomPick(langData.actions)} ${randomPick(langData.locations)}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomPick(langData.hooks);

        return {
            rumor: rumorText.trim(),
            hook: hookText
        };
    }
}