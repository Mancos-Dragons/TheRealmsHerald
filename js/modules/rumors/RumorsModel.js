import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: "Pueblo Viejo", en: "Old Town" };
        this.defaultNpcName = { es: "Desconocido", en: "Unknown" };
        this.defaultNpcRole = { es: "Viajero", en: "Traveler" };

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas que",
                    "Nadie quiere hablar de ello, pero se comenta que",
                    "Es un secreto a voces que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "ese tal {npcName} (que trabaja de {npcRole})",
                    "nuestro estimado {npcName}, el {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está invocando fuerzas que no comprende",
                    "sabe dónde está el tesoro perdido",
                    "está fabricando venenos prohibidos",
                    "hizo un pacto con un demonio",
                    "es en realidad un espía encubierto"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en las catacumbas debajo de {townName}.",
                    "en un callejón oscuro de {townName}.",
                    "a las afueras de {townName}.",
                    "en el viejo cementerio de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "Rumor has it that",
                    "Nobody wants to talk about it, but it's said that",
                    "It's an open secret that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "that {npcName} (who works as a {npcRole})",
                    "our esteemed {npcName}, the {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is summoning forces they don't understand",
                    "knows where the lost treasure is",
                    "is crafting forbidden poisons",
                    "made a pact with a demon",
                    "is actually an undercover spy"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the catacombs beneath {townName}.",
                    "in a dark alley of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the old graveyard of {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor in the tavern."
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

            const userPrompt = `Ciudad/Pueblo: ${town}
PNJ: ${name}
Rol del PNJ: ${role}`;

            const aiResponse = await AIService.generate(systemPrompt, userPrompt);
            if (aiResponse) {
                try {
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
        const langGrammar = this.grammar[lang] || this.grammar['es'];

        const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomPick(langGrammar.intros);
        const subject = randomPick(langGrammar.subjects);
        const action = randomPick(langGrammar.actions);
        // Location is sometimes optional to vary the structure, let's make it 80% chance
        const location = Math.random() < 0.8 ? " " + randomPick(langGrammar.locations) : ".";
        const hookTemplate = randomPick(langGrammar.hooks);

        let rumorText = `${intro} ${subject} ${action}${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hookTemplate;
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
