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
            es: {
                rumors: {
                    intros: [
                        "Se dice que",
                        "Las malas lenguas murmuran que",
                        "Un borracho en la taberna jura que",
                        "Se rumorea en las calles que",
                        "Alguien me dijo que",
                        "Corre el rumor de que"
                    ],
                    subjects: [
                        "{npcName}, el {npcRole} de {townName},",
                        "el misterioso {npcName}, nuestro {npcRole} en {townName},",
                        "{npcName} (el {npcRole} local en {townName})",
                        "aquel forastero llamado {npcName}, el {npcRole} de {townName},"
                    ],
                    actions: [
                        "fue visto haciendo tratos oscuros cerca del bosque viejo a medianoche.",
                        "sabe dónde está el tesoro perdido, pero tiene demasiado miedo para hablar.",
                        "está invocando fuerzas que no comprende.",
                        "no es quien dice ser y que en realidad es un espía del reino vecino.",
                        "fue visto desenterrando algo en el viejo cementerio.",
                        "hizo un pacto con un demonio de encrucijada.",
                        "es el heredero perdido de una nobleza caída en desgracia.",
                        "habla con los árboles y que los árboles le responden.",
                        "desapareció en las sombras durante la noche."
                    ]
                },
                hooks: {
                    intros: [
                        "Gancho de Aventura:",
                        "Nota para el DM:",
                        "Idea de Encuentro:",
                        "Posible Evento:"
                    ],
                    subjects: [
                        "Si los aventureros investigan el área, descubrirán que",
                        "Cuando los jugadores pregunten a los locales, verán que",
                        "Si el grupo decide seguir esta pista, se darán cuenta de que",
                        "Al presionar al PNJ en cuestión, resulta que"
                    ],
                    actions: [
                        "hay huellas misteriosas que llevan a una cueva oculta.",
                        "el diario del objetivo contiene pistas vitales para la misión principal.",
                        "fueron engañados por un rival para arruinar su reputación.",
                        "alguien está bajo los efectos de un encantamiento y necesita rescate.",
                        "es una trampa orquestada por mercenarios letales.",
                        "el PNJ es en realidad un dragón disfrazado que busca entretenerse.",
                        "una plaga extraña sigue cada uno de sus pasos, requiriendo una cura."
                    ]
                }
            },
            en: {
                rumors: {
                    intros: [
                        "They say",
                        "Rumor has it that",
                        "A drunkard in the tavern swears that",
                        "Word around town is that",
                        "Someone told me that",
                        "There is a whisper that"
                    ],
                    subjects: [
                        "{npcName}, the {npcRole} from {townName},",
                        "the mysterious {npcName}, our {npcRole} in {townName},",
                        "{npcName} (the local {npcRole} in {townName})",
                        "that stranger named {npcName}, the {npcRole} from {townName},"
                    ],
                    actions: [
                        "was seen making dark deals near the old forest at midnight.",
                        "knows where the lost treasure is, but is too afraid to speak.",
                        "is summoning forces they don't understand.",
                        "is not who they claim to be and is actually a spy from the neighboring kingdom.",
                        "was seen digging something up in the old graveyard.",
                        "made a pact with a crossroad demon.",
                        "is the lost heir of a disgraced noble family.",
                        "talks to the trees and the trees talk back.",
                        "vanished into the shadows during the night."
                    ]
                },
                hooks: {
                    intros: [
                        "Plot Hook:",
                        "DM Note:",
                        "Encounter Idea:",
                        "Possible Event:"
                    ],
                    subjects: [
                        "If the adventurers investigate the area, they will discover that",
                        "When the players ask the locals, they will see that",
                        "If the party decides to follow this lead, they will realize that",
                        "By pressing the NPC in question, it turns out that"
                    ],
                    actions: [
                        "there are mysterious footprints leading to a hidden cave.",
                        "the target's diary contains vital clues for the main quest.",
                        "they were tricked by a rival to ruin their reputation.",
                        "someone is under an enchantment and needs rescuing.",
                        "it is a trap orchestrated by lethal mercenaries.",
                        "the NPC is actually a dragon in disguise seeking entertainment.",
                        "a strange plague follows their every step, requiring a cure."
                    ]
                }
            }
        };
    }

    _getRandomFragment(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    _generateProceduralText(grammarObj, town, name, role) {
        const intro = this._getRandomFragment(grammarObj.intros);
        const subject = this._getRandomFragment(grammarObj.subjects);
        const action = this._getRandomFragment(grammarObj.actions);

        let text = `${intro} ${subject} ${action}`;
        text = text.replace(/{townName}/g, town);
        text = text.replace(/{npcName}/g, name);
        text = text.replace(/{npcRole}/g, role);

        return text;
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
        const grammarLang = this.grammar[lang] || this.grammar['es'];

        const rumorText = this._generateProceduralText(grammarLang.rumors, town, name, role);
        const hookText = this._generateProceduralText(grammarLang.hooks, town, name, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
