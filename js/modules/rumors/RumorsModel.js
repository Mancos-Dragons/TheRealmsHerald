import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { DEFAULTS } from './RumorsData.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice en las calles que",
                    "Algunos murmuran en las sombras que",
                    "Un mercader forastero jura que",
                    "Es un secreto a voces que",
                    "Nadie quiere hablar de ello, pero se rumorea que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "el misterioso {npcName} (nuestro {npcRole}),",
                    "aquel {npcName} que trabaja de {npcRole},",
                    "nadie menos que {npcName}, el mismísimo {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está buscando artefactos prohibidos",
                    "guarda un terrible secreto mágico",
                    "planea una traición inminente",
                    "escondió un cofre ensangrentado"
                ],
                locations: [
                    "cerca del viejo bosque de {townName}.",
                    "en las catacumbas ocultas bajo {townName}.",
                    "justo a las afueras de {townName}.",
                    "en las sombras del callejón más oscuro de {townName}.",
                    "en las ruinas al norte de {townName}."
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
                    "Word on the street is that",
                    "Some whisper in the shadows that",
                    "A foreign merchant swears that",
                    "It is an open secret that",
                    "No one wants to talk about it, but rumors say that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "the mysterious {npcName} (our {npcRole}),",
                    "that {npcName} who works as a {npcRole},",
                    "none other than {npcName}, the very {npcRole} themselves,"
                ],
                actions: [
                    "was seen making dark deals",
                    "is looking for forbidden artifacts",
                    "keeps a terrible magical secret",
                    "is planning an imminent betrayal",
                    "hid a bloodied chest"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the hidden catacombs beneath {townName}.",
                    "just on the outskirts of {townName}.",
                    "in the shadows of the darkest alley in {townName}.",
                    "in the ruins north of {townName}."
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

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pick(g.intros)} ${pick(g.subjects)} ${pick(g.actions)} ${pick(g.locations)}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pick(g.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
