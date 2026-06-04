import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaults = {
            town: { es: "Pueblo Viejo", en: "Old Town" },
            npcName: { es: "Desconocido", en: "Unknown" },
            npcRole: { es: "Viajero", en: "Traveler" }
        };

        this.grammar = {
            es: {
                intros: [
                    "Se dice que ",
                    "Algunos murmuran que ",
                    "Corren rumores de que ",
                    "Anoche hubo rumores de que "
                ],
                subjects: [
                    "{npcName}, el {npcRole}, ",
                    "{npcName} (nuestro {npcRole}) ",
                    "el forastero llamado {npcName}, quien actúa como {npcRole}, "
                ],
                actions: [
                    "fue visto haciendo tratos oscuros ",
                    "está invocando fuerzas que no comprende ",
                    "está fabricando venenos para un asesino a sueldo ",
                    "hizo un pacto con un demonio de encrucijada ",
                    "es en realidad un espía disfrazado "
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en las calles sombrías de {townName}.",
                    "a las afueras de {townName}.",
                    "en el cementerio de {townName}."
                ],
                hooks: [
                    "Los PJs pueden investigar el bosque para encontrar pistas.",
                    "El PNJ pedirá ayuda a los PJs de forma encubierta.",
                    "La guardia local de {townName} pagará por información.",
                    "Una secta secreta está vigilando a {npcName}."
                ]
            },
            en: {
                intros: [
                    "It is said that ",
                    "Some whisper that ",
                    "Rumor has it that ",
                    "Last night there were rumors that "
                ],
                subjects: [
                    "{npcName}, the {npcRole}, ",
                    "{npcName} (our {npcRole}) ",
                    "the stranger named {npcName}, acting as {npcRole}, "
                ],
                actions: [
                    "was seen making dark deals ",
                    "is summoning forces they don't understand ",
                    "is brewing poisons for an assassin ",
                    "made a pact with a crossroads demon ",
                    "is actually a spy in disguise "
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the shadowy streets of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the graveyard of {townName}."
                ],
                hooks: [
                    "The PCs can investigate the forest to find evidence.",
                    "The NPC will ask the PCs for help covertly.",
                    "The local guard of {townName} will pay for information.",
                    "A secret cult is watching {npcName}."
                ]
            }
        };
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';

        const town = townName || this.defaults.town[lang];
        const name = npcName || this.defaults.npcName[lang];
        const role = npcRole || this.defaults.npcRole[lang];

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

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = randomEl(langData.intros) +
                        randomEl(langData.subjects) +
                        randomEl(langData.actions) +
                        randomEl(langData.locations);

        let hookText = randomEl(langData.hooks);

        rumorText = rumorText.replace(/{townName}/g, town)
                             .replace(/{npcName}/g, name)
                             .replace(/{npcRole}/g, role);

        hookText = hookText.replace(/{townName}/g, town)
                           .replace(/{npcName}/g, name)
                           .replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
