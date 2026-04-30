import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export const DEFAULTS = {
    town: { es: "Pueblo Viejo", en: "Old Town" },
    npcName: { es: "Desconocido", en: "Unknown" },
    npcRole: { es: "Viajero", en: "Traveler" }
};

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice en {townName} que",
                    "Las malas lenguas de {townName} murmuran que",
                    "Anoche hubo rumores en {townName} de que",
                    "Un mercader forastero llegó a {townName} asegurando que",
                    "Nadie en {townName} confía plenamente cuando se menciona que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (nuestro {npcRole})",
                    "el misterioso {npcRole} conocido como {npcName}",
                    "{npcName}, quien trabaja de {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está invocando fuerzas que no comprende",
                    "es en realidad un espía del reino vecino",
                    "desenterró algo extraño",
                    "hizo un pacto con un demonio de la encrucijada",
                    "está fabricando venenos para un asesino"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "lejos de las miradas curiosas.",
                    "en las sombras del callejón.",
                    "bajo la luz de la última luna llena."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "The gossips of {townName} whisper that",
                    "Last night there were rumors in {townName} that",
                    "A foreign merchant arrived in {townName} claiming that",
                    "No one in {townName} fully trusts the talk that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (our {npcRole})",
                    "the mysterious {npcRole} known as {npcName}",
                    "{npcName}, who works as a {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is summoning forces they don't understand",
                    "is actually a spy from the neighboring kingdom",
                    "dug up something strange",
                    "made a pact with a crossroad demon",
                    "is brewing poisons for an assassin"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old cemetery.",
                    "away from prying eyes.",
                    "in the shadows of the alley.",
                    "under the light of the last full moon."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped.",
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

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = pickRandom(grammar.intros);
        let subject = pickRandom(grammar.subjects);
        let action = pickRandom(grammar.actions);
        let location = pickRandom(grammar.locations);
        let hookText = pickRandom(grammar.hooks);

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
