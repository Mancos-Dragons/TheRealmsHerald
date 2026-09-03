import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

const DEFAULTS = {
    town: { es: 'Villaverde', en: 'Oakhaven' },
    npcName: { es: 'Elric', en: 'Elric' },
    npcRole: { es: 'el herrero', en: 'the blacksmith' }
};

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice por ahí que",
                    "He escuchado un rumor de que",
                    "Un viajero me contó que",
                    "Es un secreto a voces que",
                    "Los lugareños susurran que"
                ],
                subjects: [
                    "{npcName}, {npcRole} de {townName},",
                    "{npcName}, quien trabaja como {npcRole} en {townName},",
                    "el infame {npcRole} conocido como {npcName} en {townName},"
                ],
                actions: [
                    "hizo un pacto con un demonio",
                    "esconde un tesoro robado",
                    "encontró un artefacto antiguo",
                    "es en realidad un dragón disfrazado",
                    "ha estado asesinando viajeros"
                ],
                details: [
                    "en el sótano de su casa.",
                    "para ganar más poder.",
                    "y nadie se atreve a decir nada.",
                    "durante las noches de luna llena.",
                    "y planea traicionar al alcalde."
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
                    "I heard a rumor that",
                    "A traveler told me that",
                    "It is an open secret that",
                    "The locals whisper that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, who works as the {npcRole} in {townName},",
                    "the infamous {npcRole} known as {npcName} in {townName},"
                ],
                actions: [
                    "made a pact with a demon",
                    "is hiding a stolen treasure",
                    "found an ancient artifact",
                    "is actually a dragon in disguise",
                    "has been murdering travelers"
                ],
                details: [
                    "in the basement of their house.",
                    "to gain more power.",
                    "and no one dares to speak up.",
                    "during the nights of the full moon.",
                    "and plans to betray the mayor."
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
        const grammar = this.grammar[lang] || this.grammar['es'];

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const detail = grammar.details[Math.floor(Math.random() * grammar.details.length)];
        const hook = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${detail}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hook
        };
    }
}
