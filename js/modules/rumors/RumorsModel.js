import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export const DEFAULTS = {
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
                es: [
                    "Se dice que",
                    "Corren rumores de que",
                    "Un mercader juró que",
                    "Es un secreto a voces que",
                    "Las malas lenguas aseguran que"
                ],
                en: [
                    "It is said that",
                    "Rumor has it that",
                    "A merchant swore that",
                    "It's an open secret that",
                    "Word on the street is that"
                ]
            },
            subjects: {
                es: [
                    " {npcName}, el {npcRole} de {townName},",
                    " {npcName}, quien trabaja como {npcRole} en {townName},",
                    " {npcName}, conocido por ser el {npcRole} de {townName},",
                    " {npcName}, el misterioso {npcRole} de {townName},"
                ],
                en: [
                    " {npcName}, the {npcRole} of {townName},",
                    " {npcName}, who works as a {npcRole} in {townName},",
                    " {npcName}, known as the {npcRole} of {townName},",
                    " {npcName}, the mysterious {npcRole} of {townName},"
                ]
            },
            actions: {
                es: [
                    " fue visto haciendo tratos oscuros",
                    " desenterró algo extraño",
                    " robó una reliquia antigua",
                    " habló con una figura encapuchada",
                    " estuvo practicando magia prohibida"
                ],
                en: [
                    " was seen making dark deals",
                    " dug up something strange",
                    " stole an ancient relic",
                    " spoke to a hooded figure",
                    " was practicing forbidden magic"
                ]
            },
            locations: {
                es: [
                    " cerca del bosque viejo a medianoche.",
                    " en el cementerio local.",
                    " en las ruinas al este.",
                    " detrás de la taberna.",
                    " en los túneles subterráneos."
                ],
                en: [
                    " near the old forest at midnight.",
                    " in the local cemetery.",
                    " in the ruins to the east.",
                    " behind the tavern.",
                    " in the underground tunnels."
                ]
            },
            hooks: {
                es: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ],
                en: [
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
        const intros = this.grammar.intros[lang] || this.grammar.intros['es'];
        const subjects = this.grammar.subjects[lang] || this.grammar.subjects['es'];
        const actions = this.grammar.actions[lang] || this.grammar.actions['es'];
        const locations = this.grammar.locations[lang] || this.grammar.locations['es'];
        const hooks = this.grammar.hooks[lang] || this.grammar.hooks['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pickRandom(intros);
        let subject = pickRandom(subjects);
        const action = pickRandom(actions);
        const location = pickRandom(locations);

        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        const rumorText = intro + subject + action + location;
        const hookText = pickRandom(hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
