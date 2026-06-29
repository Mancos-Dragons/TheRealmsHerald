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
                    "Corren rumores de que ",
                    "Un mercader forastero jura que "
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName}, ",
                    "{npcName}, que trabaja de {npcRole} en {townName}, ",
                    "nuestro {npcRole} {npcName} en {townName}, "
                ],
                actions: [
                    "fue visto haciendo tratos oscuros ",
                    "está invocando fuerzas extrañas ",
                    "ha estado desenterrando cosas extrañas ",
                    "tiene un pacto con un demonio de encrucijada "
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las afueras de la ciudad.",
                    "en los rincones oscuros del mercado."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ.",
                    "Gancho de Aventura: Los rumores son ciertos y el PNJ necesita ser rescatado o detenido."
                ]
            },
            en: {
                intros: [
                    "It is said that ",
                    "Some murmur that ",
                    "Rumors spread that ",
                    "A foreign merchant swears that "
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName}, ",
                    "{npcName}, working as {npcRole} in {townName}, ",
                    "our {npcRole} {npcName} in {townName}, "
                ],
                actions: [
                    "was seen making dark deals ",
                    "is summoning strange forces ",
                    "has been digging up strange things ",
                    "has a pact with a crossroads demon "
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old cemetery.",
                    "on the outskirts of the city.",
                    "in the dark corners of the market."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC.",
                    "Plot Hook: The rumors are true and the NPC needs to be rescued or stopped."
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

        let rumorText = pickRandom(grammar.intros) +
                        pickRandom(grammar.subjects) +
                        pickRandom(grammar.actions) +
                        pickRandom(grammar.locations);

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(grammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
