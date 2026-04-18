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
                    "Se dice que", "Algunos murmuran que", "Anoche hubo ruidos extraños y creen que",
                    "Dicen las malas lenguas que", "Nadie confía en", "En la taberna se susurra que",
                    "Un guardia asegura que vio a", "Se rumorea que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},", "{npcName} (el {npcRole}),", "nuestro {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros", "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende", "no es quien dice ser",
                    "está fabricando venenos para un asesino a sueldo", "hizo un pacto con un demonio",
                    "es en realidad un dragón que tomó forma humana", "tiene un mapa antiguo tatuado en la espalda",
                    "colecciona almas en frascos de cristal"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.", "en las afueras de {townName}.",
                    "cerca del viejo cementerio.", "en el mercado de {townName}.",
                    "en su propia casa.", "cerca de la encrucijada de {townName}.",
                    "en las afueras de la ciudad."
                ],
                hooks: [
                    "Los jugadores pueden seguir a {npcName} de noche para descubrir si es cierto.",
                    "El {npcRole} contrata a los jugadores para que investiguen a quien está esparciendo el rumor.",
                    "Un rival de {npcName} ofrece una recompensa si los jugadores consiguen pruebas.",
                    "La guardia local está considerando arrestar a {npcName} (el {npcRole}) si las pruebas aparecen.",
                    "Los aventureros encuentran el mapa o la llave mencionada en el rumor y {npcName} intenta recuperarlo."
                ]
            },
            en: {
                intros: [
                    "It is said that", "Some whisper that", "Last night there were strange noises and they believe that",
                    "Gossip has it that", "Nobody trusts", "In the tavern they whisper that",
                    "A guard claims he saw", "Rumor has it that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},", "{npcName} (the {npcRole}),", "our {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals", "knows where the lost treasure is",
                    "is summoning forces they don't understand", "is not who they claim to be",
                    "is brewing poisons for a hired assassin", "made a pact with a demon",
                    "is actually a dragon in human form", "has an ancient map tattooed on their back",
                    "collects souls in glass jars"
                ],
                locations: [
                    "near the old forest at midnight.", "on the outskirts of {townName}.",
                    "near the old cemetery.", "in the market of {townName}.",
                    "in their own home.", "near the crossroads of {townName}.",
                    "just outside town."
                ],
                hooks: [
                    "The players can follow {npcName} at night to find out if it's true.",
                    "The {npcRole} hires the players to investigate who is spreading the rumor.",
                    "A rival of {npcName} offers a reward if the players can gather proof.",
                    "The local guard is considering arresting {npcName} (the {npcRole}) if evidence turns up.",
                    "The adventurers find the map or key mentioned in the rumor and {npcName} tries to get it back."
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

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pickRandom(grammar.intros);
        const subject = pickRandom(grammar.subjects);
        const action = pickRandom(grammar.actions);
        const location = pickRandom(grammar.locations);
        const rawHook = pickRandom(grammar.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        // Remove double spaces that might occur
        rumorText = rumorText.replace(/\s+/g, ' ').trim();

        const replacePlaceholders = (text) => {
            return text
                .replace(/{townName}/g, town)
                .replace(/{npcName}/g, name)
                .replace(/{npcRole}/g, role);
        };

        return {
            rumor: replacePlaceholders(rumorText),
            hook: replacePlaceholders(rawHook)
        };
    }
}
