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
                    "Se dice que ",
                    "Corren rumores de que ",
                    "Un mercader me contó que ",
                    "Es un secreto a voces que ",
                    "Escuché en la taberna que "
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, quien trabaja de {npcRole} en {townName},",
                    "aquel {npcRole} de {townName} llamado {npcName}"
                ],
                actions: [
                    " esconde un tesoro maldito",
                    " hizo un pacto con un demonio",
                    " lidera un culto secreto",
                    " tiene tratos con los bandidos",
                    " es un cambiaformas en secreto"
                ],
                locations: [
                    " en el sótano de su casa.",
                    " cerca de las viejas ruinas.",
                    " en los bosques a las afueras.",
                    " bajo la luna llena.",
                    " a espaldas de la guardia."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán pistas oscuras.",
                    "Gancho de Aventura: El PNJ negará todo, pero su comportamiento será sospechoso.",
                    "Gancho de Aventura: Alguien ofrecerá oro por confirmar o desmentir este rumor.",
                    "Gancho de Aventura: El rumor es una trampa mortal dejada para aventureros incautos.",
                    "Gancho de Aventura: La milicia local está buscando mercenarios para investigar esto."
                ]
            },
            en: {
                intros: [
                    "It is said that ",
                    "Rumor has it that ",
                    "A merchant told me that ",
                    "It's an open secret that ",
                    "I heard at the tavern that "
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, who works as {npcRole} in {townName},",
                    "that {npcRole} from {townName} named {npcName}"
                ],
                actions: [
                    " hides a cursed treasure",
                    " made a pact with a demon",
                    " leads a secret cult",
                    " has dealings with bandits",
                    " is secretly a shapeshifter"
                ],
                locations: [
                    " in the basement of their house.",
                    " near the old ruins.",
                    " in the woods outside town.",
                    " under the full moon.",
                    " behind the backs of the guard."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find dark clues.",
                    "Plot Hook: The NPC will deny everything, but their behavior will be suspicious.",
                    "Plot Hook: Someone will offer gold to confirm or deny this rumor.",
                    "Plot Hook: The rumor is a deadly trap set for unwary adventurers.",
                    "Plot Hook: The local militia is looking for mercenaries to look into this."
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

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomEl(grammar.intros);
        const subject = randomEl(grammar.subjects);
        const action = randomEl(grammar.actions);
        const location = randomEl(grammar.locations);

        let rumorText = `${intro}${subject}${action}${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomEl(grammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
