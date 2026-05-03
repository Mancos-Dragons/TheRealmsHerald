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
                    "Se dice en las calles de {townName} que",
                    "Un mercader forastero en {townName} jura que",
                    "Los guardias de {townName} murmuran que",
                    "En la última luna llena en {townName},",
                    "Nadie confía en nadie desde que en {townName}"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (nuestro {npcRole})",
                    "aquel al que llaman {npcName}, el {npcRole},"
                ],
                actions: [
                    "está invocando fuerzas oscuras",
                    "fue visto haciendo tratos extraños",
                    "desenterró un antiguo artefacto",
                    "planea asesinar al alcalde",
                    "roba reliquias de las tumbas"
                ],
                locations: [
                    "cerca del cementerio viejo.",
                    "en el callejón de las sombras.",
                    "bajo la taberna principal.",
                    "en las afueras del pueblo.",
                    "en la mansión abandonada."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor.",
                    "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado."
                ]
            },
            en: {
                intros: [
                    "Word on the streets of {townName} is that",
                    "A foreign merchant in {townName} swears that",
                    "The guards of {townName} whisper that",
                    "During the last full moon in {townName},",
                    "No one trusts anyone since in {townName}"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (our {npcRole})",
                    "the one they call {npcName}, the {npcRole},"
                ],
                actions: [
                    "is summoning dark forces",
                    "was seen making strange deals",
                    "unearthed an ancient artifact",
                    "plans to assassinate the mayor",
                    "steals relics from the tombs"
                ],
                locations: [
                    "near the old graveyard.",
                    "in the alley of shadows.",
                    "beneath the main tavern.",
                    "on the outskirts of town.",
                    "in the abandoned mansion."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor.",
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
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];
        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

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
