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
                    "Es un secreto a voces que",
                    "Cuentan los viajeros que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "el misterioso {npcRole} de {townName}, conocido como {npcName},",
                    "ese {npcRole} de {townName} al que llaman {npcName},"
                ],
                actions: [
                    "hizo un pacto con un demonio a medianoche.",
                    "esconde un tesoro maldito bajo su casa.",
                    "planea derrocar al alcalde pronto.",
                    "fue visto hablando con los muertos en el viejo cementerio.",
                    "en realidad es un dragón disfrazado."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan, encontrarán rastros oscuros y serán emboscados.",
                    "Gancho de Aventura: El PNJ pedirá ayuda a los aventureros porque está siendo chantajeado.",
                    "Gancho de Aventura: Todo es una ilusión creada por un rival para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos, y deben detener el ritual antes de la próxima luna llena.",
                    "Gancho de Aventura: El alcalde ofrece una gran recompensa por desmentir o confirmar estos hechos."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "Rumor has it in the tavern that",
                    "It is an open secret that",
                    "Travelers claim that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "the mysterious {npcRole} of {townName}, known as {npcName},",
                    "that {npcRole} from {townName} called {npcName},"
                ],
                actions: [
                    "made a pact with a demon at midnight.",
                    "hides a cursed treasure beneath their house.",
                    "is planning to overthrow the mayor soon.",
                    "was seen speaking to the dead in the old graveyard.",
                    "is actually a dragon in disguise."
                ],
                hooks: [
                    "Plot Hook: If the players investigate, they will find dark trails and be ambushed.",
                    "Plot Hook: The NPC will ask the adventurers for help because they are being blackmailed.",
                    "Plot Hook: Everything is an illusion created by a rival to ruin their reputation.",
                    "Plot Hook: The rumors are true, and they must stop the ritual before the next full moon.",
                    "Plot Hook: The mayor offers a large reward for disproving or confirming these events."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subjectRaw = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let subject = subjectRaw;
        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        const rumorText = `${intro} ${subject} ${action}`;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
