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
                    "Se dice que",
                    "Algunos murmuran que",
                    "Hay rumores de que",
                    "Dicen las malas lenguas que",
                    "Nadie quiere hablar de ello, pero dicen que",
                    "Un forastero aseguró que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro querido {npcName}, el {npcRole} de {townName},"
                ],
                actions: [
                    "hizo un pacto oscuro",
                    "encontró un tesoro maldito",
                    "está invocando fuerzas oscuras",
                    "robó algo muy valioso",
                    "es en realidad un espía encubierto",
                    "está conspirando contra el alcalde"
                ],
                locations: [
                    "en el cementerio viejo.",
                    "en las afueras de la ciudad.",
                    "en el bosque cercano.",
                    "en el sótano de la taberna.",
                    "a medianoche.",
                    "cerca de la encrucijada."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse."
                ]
            },
            en: {
                intros: [
                    "They say that",
                    "Some whisper that",
                    "There are rumors that",
                    "Word around town is that",
                    "Nobody wants to talk about it, but they say that",
                    "A stranger claimed that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "our dear {npcName}, the {npcRole} of {townName},"
                ],
                actions: [
                    "made a dark pact",
                    "found a cursed treasure",
                    "is summoning dark forces",
                    "stole something very valuable",
                    "is actually an undercover spy",
                    "is conspiring against the mayor"
                ],
                locations: [
                    "in the old graveyard.",
                    "on the outskirts of town.",
                    "in the nearby forest.",
                    "in the tavern's basement.",
                    "at midnight.",
                    "near the crossroads."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse."
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

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
