import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "He escuchado que",
                    "Un pajarito me dijo que",
                    "Es un secreto a voces que",
                    "Corre el rumor de que"
                ],
                subjects: [
                    "el bueno de {npcName}, el {npcRole} de {townName},",
                    "aquel sospechoso de {npcName}, quien trabaja de {npcRole} en {townName},",
                    "la enigmática figura de {npcName}, {npcRole} de {townName},",
                    "{npcName}, el {npcRole} más infame de {townName},",
                    "{npcName}, el humilde {npcRole} local de {townName},"
                ],
                actions: [
                    "está escondiendo un alijo de oro",
                    "hizo un pacto con un demonio",
                    "envenenó el suministro de agua",
                    "planea derrocar al alcalde",
                    "descubrió una ruina antigua"
                ],
                locations: [
                    "bajo su propia casa.",
                    "en el cementerio cercano.",
                    "cerca del viejo molino abandonado.",
                    "en las cuevas más allá del bosque.",
                    "en el sótano de la taberna local."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ],
                defaults: {
                    town: "el pueblo",
                    npcName: "un extraño",
                    npcRole: "habitante"
                }
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "I heard a whisper that",
                    "It's a poorly kept secret that",
                    "Rumor has it that",
                    "Some folks claim that"
                ],
                subjects: [
                    "good old {npcName}, the {npcRole} of {townName},",
                    "that suspicious {npcName}, working as a {npcRole} in {townName},",
                    "the enigmatic {npcName}, the {npcRole} of {townName},",
                    "{npcName}, the most infamous {npcRole} in {townName},",
                    "{npcName}, the humble local {npcRole} of {townName},"
                ],
                actions: [
                    "is hiding a stash of gold",
                    "made a pact with a demon",
                    "poisoned the water supply",
                    "is planning to overthrow the mayor",
                    "discovered an ancient ruin"
                ],
                locations: [
                    "under their own house.",
                    "in the nearby graveyard.",
                    "near the old abandoned mill.",
                    "in the caves beyond the forest.",
                    "in the basement of the local tavern."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap."
                ],
                defaults: {
                    town: "the town",
                    npcName: "a stranger",
                    npcRole: "resident"
                }
            }
        };
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';

        const town = townName || (this.grammar[lang] ? this.grammar[lang].defaults.town : this.grammar['es'].defaults.town);
        const name = npcName || (this.grammar[lang] ? this.grammar[lang].defaults.npcName : this.grammar['es'].defaults.npcName);
        const role = npcRole || (this.grammar[lang] ? this.grammar[lang].defaults.npcRole : this.grammar['es'].defaults.npcRole);

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

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pick(grammar.intros);
        let subject = pick(grammar.subjects);
        const action = pick(grammar.actions);
        const location = pick(grammar.locations);
        const hookText = pick(grammar.hooks);

        // Replace placeholders in subject
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
