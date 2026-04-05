import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { DEFAULTS } from './RumorsData.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            intros: {
                es: ["Se dice que", "Algunos murmuran que", "Anoche hubo rumores de que", "Dicen las malas lenguas en {townName} que", "Nadie confía en esto, pero dicen que"],
                en: ["They say", "Some whisper that", "Last night there were rumors that", "Word around {townName} is that", "Nobody trusts this, but they say"]
            },
            subjects: {
                es: ["{npcName}, el {npcRole} de {townName},", "{npcName} (el {npcRole} de {townName}),", "nuestro {npcRole} en {townName}, {npcName},", "{npcName}, el misterioso {npcRole} de {townName},", "el infame {npcRole} de {townName}, {npcName},"],
                en: ["{npcName}, the {npcRole} of {townName},", "{npcName} (the {npcRole} of {townName}),", "our {npcRole} in {townName}, {npcName},", "{npcName}, the mysterious {npcRole} of {townName},", "the infamous {npcRole} of {townName}, {npcName},"]
            },
            actions: {
                es: ["fue visto haciendo tratos oscuros", "sabe dónde está el tesoro perdido", "está invocando fuerzas que no comprende", "es en realidad un espía del reino vecino", "hizo un pacto con un demonio", "está fabricando venenos", "puede hablar con los muertos", "colecciona almas en frascos de cristal"],
                en: ["was seen making dark deals", "knows where the lost treasure is", "is summoning forces they don't understand", "is actually a spy from the neighboring kingdom", "made a pact with a demon", "is crafting poisons", "can speak to the dead", "collects souls in glass jars"]
            },
            locations: {
                es: ["cerca del bosque viejo a medianoche.", "en el viejo cementerio.", "en la taberna local.", "en las afueras de la ciudad.", "en una cueva oculta.", "en el sótano de su casa."],
                en: ["near the old forest at midnight.", "in the old graveyard.", "in the local tavern.", "on the outskirts of town.", "in a hidden cave.", "in the basement of their house."]
            },
            hooks: {
                es: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ necesita ser rescatado o detenido.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado.",
                    "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado."
                ],
                en: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC.",
                    "Plot Hook: The rumors are true. The NPC needs to be rescued or stopped.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions.",
                    "Plot Hook: The NPC begs the players for help because they are being blackmailed."
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
        const intros = this.grammar.intros[lang] || this.grammar.intros['es'];
        const subjects = this.grammar.subjects[lang] || this.grammar.subjects['es'];
        const actions = this.grammar.actions[lang] || this.grammar.actions['es'];
        const locations = this.grammar.locations[lang] || this.grammar.locations['es'];
        const hooks = this.grammar.hooks[lang] || this.grammar.hooks['es'];

        const intro = intros[Math.floor(Math.random() * intros.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const hook = hooks[Math.floor(Math.random() * hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hook;
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
