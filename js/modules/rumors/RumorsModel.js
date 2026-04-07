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
                    "Se dice en las calles de {townName} que",
                    "Corre el rumor en {townName} de que",
                    "Un mercader forastero llegó a {townName} contando que",
                    "Los guardias de {townName} murmuran que",
                    "Nadie quiere hablar de ello en {townName}, pero"
                ],
                subjects: [
                    "{npcName}, el misterioso {npcRole},",
                    "{npcName} (nuestro querido {npcRole})",
                    "el {npcRole} llamado {npcName}",
                    "esa persona tan extraña, {npcName} el {npcRole},",
                    "{npcName}, quien todos creen que es solo un {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está fabricando venenos prohibidos",
                    "es en realidad un espía infiltrado",
                    "hizo un pacto con un demonio",
                    "habla con seres de otros mundos"
                ],
                locations: [
                    "cerca del viejo cementerio.",
                    "en el bosque profundo a medianoche.",
                    "en los sótanos de la taberna.",
                    "donde antes había una iglesia.",
                    "cada vez que hay luna llena."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ necesita ser rescatado o detenido pronto.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor."
                ]
            },
            en: {
                intros: [
                    "It is said in the streets of {townName} that",
                    "There's a rumor going around {townName} that",
                    "A foreign merchant arrived in {townName} claiming that",
                    "The guards in {townName} whisper that",
                    "Nobody wants to talk about it in {townName}, but"
                ],
                subjects: [
                    "{npcName}, the mysterious {npcRole},",
                    "{npcName} (our dear {npcRole})",
                    "the {npcRole} named {npcName}",
                    "that strange person, {npcName} the {npcRole},",
                    "{npcName}, who everyone thinks is just a {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is brewing forbidden poisons",
                    "is actually an undercover spy",
                    "made a pact with a demon",
                    "talks to beings from other worlds"
                ],
                locations: [
                    "near the old graveyard.",
                    "in the deep woods at midnight.",
                    "in the tavern's cellars.",
                    "where a church used to be.",
                    "whenever there's a full moon."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival to ruin their reputation.",
                    "Plot Hook: The rumors are true. The NPC needs to be rescued or stopped soon.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor."
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

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pick(grammar.intros)} ${pick(grammar.subjects)} ${pick(grammar.actions)} ${pick(grammar.locations)}`;
        let hookText = pick(grammar.hooks);

        const replaceVars = (text) => text
            .replace(/{townName}/g, town)
            .replace(/{npcName}/g, name)
            .replace(/{npcRole}/g, role);

        return {
            rumor: replaceVars(rumorText),
            hook: replaceVars(hookText)
        };
    }
}
