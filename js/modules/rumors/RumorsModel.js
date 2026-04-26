import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: 'un pueblo cercano', en: 'a nearby town' };
        this.defaultNpcName = { es: 'un extraño', en: 'a stranger' };
        this.defaultNpcRole = { es: 'viajero', en: 'traveler' };

        this.grammar = {
            es: {
                intros: [
                    "Se dice en las calles de {townName} que",
                    "Un viejo borracho en la taberna de {townName} jura que",
                    "Es un secreto a voces en {townName} que",
                    "Los guardias de {townName} murmuran que",
                    "Cuenta la leyenda en {townName} que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "el misterioso {npcRole} llamado {npcName},",
                    "aquel {npcRole} conocido como {npcName},"
                ],
                actions: [
                    "hizo un pacto oscuro a medianoche",
                    "encontró un artefacto prohibido",
                    "esconde un tesoro maldito en su sótano",
                    "planea derrocar al líder local",
                    "fue visto hablando con espíritus",
                    "guarda el mapa de unas ruinas olvidadas"
                ],
                locations: [
                    "en el bosque cercano.",
                    "bajo las alcantarillas de la ciudad.",
                    "en las montañas del norte.",
                    "cerca del antiguo cementerio.",
                    "en las sombras del callejón."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán pistas que confirman esta historia.",
                    "Gancho de Aventura: El PNJ negará todo, pero su comportamiento es sospechoso.",
                    "Gancho de Aventura: Una facción rival pagará bien por confirmar este rumor.",
                    "Gancho de Aventura: Investigar esto desatará una serie de eventos peligrosos."
                ]
            },
            en: {
                intros: [
                    "It is said in the streets of {townName} that",
                    "An old drunk in the tavern of {townName} swears that",
                    "It is an open secret in {townName} that",
                    "The guards of {townName} whisper that",
                    "Legend has it in {townName} that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "the mysterious {npcRole} named {npcName},",
                    "that {npcRole} known as {npcName},"
                ],
                actions: [
                    "made a dark pact at midnight",
                    "found a forbidden artifact",
                    "hides a cursed treasure in their basement",
                    "plans to overthrow the local leader",
                    "was seen talking to spirits",
                    "keeps the map to forgotten ruins"
                ],
                locations: [
                    "in the nearby forest.",
                    "beneath the city sewers.",
                    "in the northern mountains.",
                    "near the old cemetery.",
                    "in the shadows of the alley."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find clues confirming this story.",
                    "Plot Hook: The NPC will deny everything, but their behavior is suspicious.",
                    "Plot Hook: A rival faction will pay well to confirm this rumor.",
                    "Plot Hook: Investigating this will trigger a series of dangerous events."
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
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}