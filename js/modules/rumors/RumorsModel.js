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
                    "Es un secreto a voces que",
                    "Escuché en la taberna que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "el misterioso {npcRole} llamado {npcName} que vive en {townName}",
                    "nuestro {npcRole}, {npcName}, de aquí de {townName}"
                ],
                actions: [
                    "hizo un pacto oscuro",
                    "encontró un artefacto antiguo",
                    "está conspirando con bandidos",
                    "tiene un tesoro escondido",
                    "fue visto invocando demonios"
                ],
                locations: [
                    "cerca del cementerio viejo.",
                    "en las afueras del pueblo.",
                    "bajo el amparo de la noche.",
                    "en los bosques oscuros.",
                    "en las ruinas abandonadas."
                ],
                hooks: [
                    "Los aventureros podrían investigar el lugar mencionado.",
                    "El PNJ intentará contratar a los aventureros para que lo encubran.",
                    "La guardia local está a punto de arrestarlo, tal vez necesite ayuda o merezca su destino.",
                    "Un rival está esparciendo este rumor, sea cierto o no.",
                    "Alguien más desapareció después de descubrir esto."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "Some whisper that",
                    "Rumor has it that",
                    "It is a poorly kept secret that",
                    "I heard at the tavern that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "the mysterious {npcRole} named {npcName} living in {townName}",
                    "our very own {npcRole}, {npcName}, from {townName}"
                ],
                actions: [
                    "made a dark pact",
                    "found an ancient artifact",
                    "is conspiring with bandits",
                    "has a hidden treasure",
                    "was seen summoning demons"
                ],
                locations: [
                    "near the old graveyard.",
                    "on the outskirts of town.",
                    "under the cover of night.",
                    "in the dark woods.",
                    "at the abandoned ruins."
                ],
                hooks: [
                    "The adventurers could investigate the mentioned location.",
                    "The NPC might try to hire the adventurers to cover it up.",
                    "The local guard is about to arrest them; they might need help or deserve their fate.",
                    "A rival is spreading this rumor, whether it's true or not.",
                    "Someone else went missing after discovering this."
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
            rumor: rumorText,
            hook: hookText
        };
    }
}
