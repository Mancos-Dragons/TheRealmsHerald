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
                    "Dicen las malas lenguas que",
                    "Hay rumores de que",
                    "Nadie quiere hablar del tema, pero dicen que",
                    "Es un secreto a voces que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro vecino {npcName} (el {npcRole} de {townName}),",
                    "{npcName}, quien trabaja como {npcRole} en {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas oscuras",
                    "no es quien dice ser",
                    "fue visto desenterrando algo",
                    "hizo un pacto con un demonio",
                    "colecciona almas en frascos"
                ],
                details: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "y nadie comprende lo que busca.",
                    "para un gremio de ladrones.",
                    "en el viejo cementerio.",
                    "y todo terminará en tragedia.",
                    "cuando no hay nadie mirando."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "Rumor has it that",
                    "There are rumors that",
                    "Nobody wants to talk about it, but they say",
                    "It's an open secret that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "our neighbor {npcName} (the {npcRole} of {townName}),",
                    "{npcName}, who works as a {npcRole} in {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning dark forces",
                    "is not who they claim to be",
                    "was seen digging something up",
                    "made a pact with a demon",
                    "collects souls in jars"
                ],
                details: [
                    "near the old forest at midnight.",
                    "but is too afraid to speak.",
                    "and nobody understands what they are looking for.",
                    "for a thieves' guild.",
                    "in the old graveyard.",
                    "and it will all end in tragedy.",
                    "when nobody is looking."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap."
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
        const grammarLang = this.grammar[lang] || this.grammar['es'];

        const randomIntro = grammarLang.intros[Math.floor(Math.random() * grammarLang.intros.length)];
        const randomSubject = grammarLang.subjects[Math.floor(Math.random() * grammarLang.subjects.length)];
        const randomAction = grammarLang.actions[Math.floor(Math.random() * grammarLang.actions.length)];
        const randomDetail = grammarLang.details[Math.floor(Math.random() * grammarLang.details.length)];
        const randomHook = grammarLang.hooks[Math.floor(Math.random() * grammarLang.hooks.length)];

        let rumorText = `${randomIntro} ${randomSubject} ${randomAction} ${randomDetail}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: randomHook
        };
    }
}
