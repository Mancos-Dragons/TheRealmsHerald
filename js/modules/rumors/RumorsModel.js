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
                    "Se dice en la posada que",
                    "Un mercader forastero jura que",
                    "Dicen las malas lenguas de {townName} que",
                    "Es un secreto a voces que",
                    "Anoche escuché a dos guardias comentar que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName}, nuestro {npcRole},",
                    "ese tal {npcName} (el {npcRole})",
                    "el {npcRole} que llamamos {npcName}",
                    "nadie menos que {npcName}, el {npcRole},"
                ],
                actions: [
                    "hizo un pacto con entidades oscuras",
                    "está escondiendo un tesoro robado",
                    "planea asesinar al alcalde",
                    "en realidad es un espía infiltrado",
                    "descubrió una ruina antigua"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en los túneles debajo de {townName}.",
                    "justo en las narices de la guardia.",
                    "en el viejo cementerio.",
                    "en las montañas del norte."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna."
                ]
            },
            en: {
                intros: [
                    "Word at the tavern is that",
                    "A foreign merchant swears that",
                    "Rumor has it in {townName} that",
                    "It's an open secret that",
                    "Last night I heard two guards whispering that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName}, our {npcRole},",
                    "that {npcName} (the {npcRole})",
                    "the {npcRole} we call {npcName}",
                    "none other than {npcName}, the {npcRole},"
                ],
                actions: [
                    "made a pact with dark entities",
                    "is hiding stolen treasure",
                    "plans to assassinate the mayor",
                    "is actually an undercover spy",
                    "discovered an ancient ruin"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the tunnels beneath {townName}.",
                    "right under the guard's nose.",
                    "in the old graveyard.",
                    "in the northern mountains."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment.",
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

        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = getRandom(grammar.intros);
        let subject = getRandom(grammar.subjects);
        let action = getRandom(grammar.actions);
        let location = getRandom(grammar.locations);
        let hook = getRandom(grammar.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hook.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
