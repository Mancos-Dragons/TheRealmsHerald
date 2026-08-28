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
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas en la taberna que",
                    "Un guardia asegura que",
                    "Se rumorea por ahí que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "aquel que conocemos como {npcName}, el {npcRole} de {townName},",
                    "nuestro misterioso {npcName} (el {npcRole} de {townName})"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros cerca del bosque a medianoche.",
                    "sabe dónde está el tesoro perdido, pero tiene demasiado miedo para hablar.",
                    "está invocando fuerzas que no comprende.",
                    "no es quien dice ser y en realidad es un espía.",
                    "desenterró algo extraño en el viejo cementerio.",
                    "es en realidad un dragón que tomó forma humana.",
                    "está fabricando venenos para un asesino a sueldo."
                ],
                hookIntros: [
                    "Gancho: Los jugadores podrían investigar y descubrir que",
                    "DM Note: Si los jugadores confrontan al PNJ, se revelará que",
                    "Idea: Este rumor es falso, pero alguien lo esparció porque"
                ],
                hookActions: [
                    "hay un culto secreto operando en las sombras.",
                    "el PNJ necesita ayuda desesperadamente pero no puede pedirla.",
                    "todo es una trampa planeada por un enemigo de los jugadores.",
                    "el tesoro maldito ya fue encontrado y está corrompiendo al pueblo.",
                    "hay un portal a otro plano escondido bajo su casa."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it in the tavern that",
                    "A guard swears that",
                    "Word on the street is that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "the one known as {npcName}, the {npcRole} of {townName},",
                    "our mysterious {npcName} (the {npcRole} of {townName})"
                ],
                actions: [
                    "was seen making dark deals near the forest at midnight.",
                    "knows where the lost treasure is, but is too afraid to speak.",
                    "is summoning forces they do not understand.",
                    "is not who they claim to be and is actually a spy.",
                    "dug up something strange in the old graveyard.",
                    "is actually a dragon in human form.",
                    "is brewing poisons for a hired assassin."
                ],
                hookIntros: [
                    "Hook: The players could investigate and find out that",
                    "DM Note: If the players confront the NPC, it will be revealed that",
                    "Idea: This rumor is false, but someone spread it because"
                ],
                hookActions: [
                    "there is a secret cult operating in the shadows.",
                    "the NPC desperately needs help but cannot ask for it.",
                    "it is all a trap planned by an enemy of the players.",
                    "the cursed treasure was already found and is corrupting the town.",
                    "there is a portal to another plane hidden under their house."
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

        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = getRandom(grammar.intros);
        let subject = getRandom(grammar.subjects);
        let action = getRandom(grammar.actions);

        let hookIntro = getRandom(grammar.hookIntros);
        let hookAction = getRandom(grammar.hookActions);

        let rumorText = `${intro} ${subject} ${action}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = `${hookIntro} ${hookAction}`;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
