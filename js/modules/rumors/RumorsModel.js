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
                    "Se rumorea en la taberna que",
                    "Un viajero asegura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (nuestro {npcRole} en {townName})",
                    "el misterioso {npcName}, conocido {npcRole} de {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "estaba invocando fuerzas oscuras",
                    "es en realidad un espía",
                    "hizo un pacto con un demonio"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en las afueras de {townName}.",
                    "en el callejón detrás de la taberna de {townName}.",
                    "en las ruinas cerca de {townName}.",
                    "en su propia casa en {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan {townName}, encontrarán pistas sobre {npcName} ({npcRole}).",
                    "Gancho de Aventura: {npcName} (el {npcRole}) ofrecerá oro a los jugadores en {townName} para mantener el secreto.",
                    "Gancho de Aventura: Los jugadores son atacados en {townName} por mercenarios contratados por {npcName}, el {npcRole}.",
                    "Gancho de Aventura: Este rumor en {townName} es una trampa mortal puesta por {npcName}, el {npcRole}."
                ]
            },
            en: {
                intros: [
                    "They say that",
                    "Some whisper that",
                    "Rumor has it that",
                    "It is heard in the tavern that",
                    "A traveler swears that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} (our {npcRole} in {townName})",
                    "the mysterious {npcName}, known {npcRole} of {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "was summoning dark forces",
                    "is actually a spy",
                    "made a pact with a demon"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "on the outskirts of {townName}.",
                    "in the alley behind the tavern of {townName}.",
                    "in the ruins near {townName}.",
                    "in their own house in {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate {townName}, they will find clues about {npcName} ({npcRole}).",
                    "Plot Hook: {npcName} (the {npcRole}) will offer gold to the players in {townName} to keep the secret.",
                    "Plot Hook: The players are attacked in {townName} by mercenaries hired by {npcName}, the {npcRole}.",
                    "Plot Hook: This rumor in {townName} is a deadly trap set by {npcName}, the {npcRole}."
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
        const hookTemplate = randomEl(grammar.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        let hookText = hookTemplate;

        // Substitute variables
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
