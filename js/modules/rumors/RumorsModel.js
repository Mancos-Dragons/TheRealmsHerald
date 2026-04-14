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
                    "Se dice que", "Algunos murmuran que", "Dicen las malas lenguas que",
                    "Hay rumores de que", "Un mercader forastero asegura que", "Los niños dicen que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},", "{npcName} (el {npcRole})", "nuestro querido {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros a medianoche",
                    "sabe dónde está el tesoro perdido, pero tiene miedo de hablar",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "está fabricando venenos para un asesino",
                    "hizo un pacto con un demonio"
                ],
                locations: [
                    "cerca de {townName}.", "en las afueras de {townName}.",
                    "en las sombras de {townName}.", "en la taberna de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo un encantamiento."
                ]
            },
            en: {
                intros: [
                    "It is said that", "Some murmur that", "Rumor has it that",
                    "There are whispers that", "A traveling merchant claims that", "The children say that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},", "{npcName} (the {npcRole})", "our dear {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals at midnight",
                    "knows where the lost treasure is, but is afraid to speak",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is a spy",
                    "is brewing poisons for an assassin",
                    "made a pact with a demon"
                ],
                locations: [
                    "near {townName}.", "on the outskirts of {townName}.",
                    "in the shadows of {townName}.", "in the tavern of {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment."
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

            const userPrompt = `Ciudad/Pueblo: ${town}
PNJ: ${name}
Rol del PNJ: ${role}`;

            const aiResponse = await AIService.generate(systemPrompt, userPrompt);
            if (aiResponse) {
                try {
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

        const grammar = this.grammar[lang] || this.grammar['es'];

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pick(grammar.intros);
        const subject = pick(grammar.subjects).replace('{npcName}', name).replace('{npcRole}', role);
        const action = pick(grammar.actions);

        let rumorText = `${intro} ${subject} ${action}`;

        // Optional location to add variance (50% chance)
        if (Math.random() > 0.5) {
            const location = pick(grammar.locations).replace('{townName}', town);
            rumorText += ` ${location}`;
        } else {
            rumorText += ".";
        }

        const hookText = pick(grammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
