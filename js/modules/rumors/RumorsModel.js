import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

const DEFAULTS = {
    town: { es: "Pueblo Viejo", en: "Old Town" },
    npcName: { es: "Desconocido", en: "Unknown" },
    npcRole: { es: "Viajero", en: "Traveler" }
};

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            intros: {
                es: ["Se dice que", "Algunos murmuran que", "Anoche escuché que", "Dicen las malas lenguas en el mercado que", "Nadie confía del todo en esto, pero dicen que"],
                en: ["It is said that", "Some whisper that", "Last night I heard that", "Rumor has it in the market that", "No one fully trusts this, but they say that"]
            },
            subjects: {
                es: ["{npcName}, el {npcRole} de {townName},", "nuestro conocido {npcName}, quien trabaja como {npcRole} en {townName},", "esa figura misteriosa de {townName}, {npcName} (el {npcRole}),"],
                en: ["{npcName}, the {npcRole} of {townName},", "our known {npcName}, who works as {npcRole} in {townName},", "that mysterious figure from {townName}, {npcName} (the {npcRole}),"]
            },
            actions: {
                es: ["fue visto haciendo tratos oscuros", "sabe dónde está el tesoro perdido", "está invocando fuerzas que no comprende", "no es quien dice ser y es un espía", "hizo un pacto con un demonio de encrucijada"],
                en: ["was seen making dark deals", "knows where the lost treasure is", "is summoning forces they don't understand", "is not who they claim to be and is a spy", "made a pact with a crossroads demon"]
            },
            locations: {
                es: ["cerca del bosque viejo a medianoche.", "y tiene demasiado miedo para hablar.", "en el viejo cementerio.", "en las sombras durante su ronda.", "en el sótano de su casa."],
                en: ["near the old forest at midnight.", "and is too afraid to speak.", "in the old cemetery.", "in the shadows during their patrol.", "in the basement of their house."]
            },
            hooks: {
                es: [
                    "DM Notes: Los jugadores pueden investigar el bosque viejo y encontrar pistas de un ritual.",
                    "DM Notes: Un mapa antiguo podría estar oculto en las pertenencias del PNJ.",
                    "DM Notes: El demonio o fuerza extraña empieza a corromper el pueblo, los jugadores deben detenerlo.",
                    "DM Notes: Espías del reino vecino podrían atacar a los jugadores si se acercan demasiado a la verdad.",
                    "DM Notes: Descubrir el sótano revelará un pasadizo a una mazmorra olvidada."
                ],
                en: [
                    "DM Notes: Players can investigate the old forest and find clues of a ritual.",
                    "DM Notes: An ancient map might be hidden in the NPC's belongings.",
                    "DM Notes: The demon or strange force begins to corrupt the town, players must stop it.",
                    "DM Notes: Spies from the neighboring kingdom might attack the players if they get too close to the truth.",
                    "DM Notes: Discovering the basement will reveal a passage to a forgotten dungeon."
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
        const intros = this.grammar.intros[lang] || this.grammar.intros['es'];
        const subjects = this.grammar.subjects[lang] || this.grammar.subjects['es'];
        const actions = this.grammar.actions[lang] || this.grammar.actions['es'];
        const locations = this.grammar.locations[lang] || this.grammar.locations['es'];
        const hooks = this.grammar.hooks[lang] || this.grammar.hooks['es'];

        const intro = intros[Math.floor(Math.random() * intros.length)];
        let subject = subjects[Math.floor(Math.random() * subjects.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const hookText = hooks[Math.floor(Math.random() * hooks.length)];

        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        const rumorText = `${intro} ${subject} ${action} ${location}`;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
