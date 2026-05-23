import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaults = {
            town: { es: "Pueblo Viejo", en: "Old Town" },
            npcName: { es: "Desconocido", en: "Unknown" },
            npcRole: { es: "Viajero", en: "Traveler" }
        };

        this.defaultTown = this.defaults.town;
        this.defaultNpcName = this.defaults.npcName;
        this.defaultNpcRole = this.defaults.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Anoche hubo ruidos y todos piensan que",
                    "Es un secreto a voces que",
                    "Corren rumores de que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, conocido como el {npcRole} de {townName},",
                    "el famoso {npcRole} de {townName}, llamado {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "tiene un pacto con seres de otro plano",
                    "esconde un oscuro secreto en su sótano"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en las afueras de la ciudad.",
                    "justo bajo las narices de la guardia.",
                    "en las ruinas antiguas.",
                    "en el cementerio local."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: Una extraña plaga sigue a los pasos del PNJ; los aventureros deben encontrar una cura mítica."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "There were noises last night and everyone thinks that",
                    "It is an open secret that",
                    "Rumors are flying that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, known as the {npcRole} of {townName},",
                    "the famous {npcRole} of {townName}, named {npcName},"
                ],
                actions: [
                    "was seen making shady deals",
                    "knows where a lost treasure is",
                    "is summoning forces they do not understand",
                    "has a pact with beings from another plane",
                    "hides a dark secret in their basement"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "on the outskirts of the town.",
                    "right under the guard's noses.",
                    "in the ancient ruins.",
                    "in the local graveyard."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: A strange plague follows in the NPC's footsteps; the adventurers must find a mythical cure."
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
