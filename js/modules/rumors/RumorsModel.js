import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export const DEFAULTS = {
    town: { es: 'Fuerte Invierno', en: 'Winterkeep' },
    npcName: { es: 'Eldrin', en: 'Eldrin' },
    npcRole: { es: 'el mercader', en: 'the merchant' }
};

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Me han dicho que",
                    "Se rumorea en las calles que",
                    "Un pajarito me contó que",
                    "Es un secreto a voces que",
                    "No me lo vas a creer, pero dicen que"
                ],
                subjects: [
                    "{npcName}, {npcRole},",
                    "el infame {npcName}, conocido como {npcRole},"
                ],
                actions: [
                    "esconde un oscuro secreto en su sótano",
                    "tiene un pacto con entidades de otros planos",
                    "planea robar el tesoro de la ciudad",
                    "en realidad es un dragón disfrazado",
                    "ha estado comprando reliquias prohibidas"
                ],
                locations: [
                    "en las afueras de {townName}.",
                    "justo bajo las narices de todo {townName}.",
                    "cerca de la plaza mayor de {townName}.",
                    "y por eso nadie confía en él en {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán pistas vitales.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene la verdad.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado.",
                    "Gancho de Aventura: Esto es un malentendido creado por un rival para arruinar su reputación.",
                    "Gancho de Aventura: El PNJ pedirá ayuda a los jugadores porque está siendo extorsionado."
                ]
            },
            en: {
                intros: [
                    "I've been told that",
                    "Rumor has it on the streets that",
                    "A little bird told me that",
                    "It is an open secret that",
                    "You won't believe this, but they say"
                ],
                subjects: [
                    "{npcName}, {npcRole},",
                    "the infamous {npcName}, known as {npcRole},"
                ],
                actions: [
                    "hides a dark secret in their basement",
                    "has a pact with entities from other planes",
                    "plans to steal the city's treasure",
                    "is actually a dragon in disguise",
                    "has been buying forbidden relics"
                ],
                locations: [
                    "on the outskirts of {townName}.",
                    "right under everyone's noses in {townName}.",
                    "near the main square of {townName}.",
                    "and that's why nobody trusts them in {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find vital clues.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary holds the truth.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions.",
                    "Plot Hook: This is a misunderstanding created by a rival to ruin their reputation.",
                    "Plot Hook: The NPC will ask the players for help because they are being blackmailed."
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
        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
