import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { RUMOR_TEMPLATES, PLOT_HOOKS, DEFAULT_TOWN, DEFAULT_NPC_NAME, DEFAULT_NPC_ROLE } from './RumorsData.js';

export default class RumorsModel {
    constructor() {
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';

        const town = townName || DEFAULT_TOWN[lang];
        const name = npcName || DEFAULT_NPC_NAME[lang];
        const role = npcRole || DEFAULT_NPC_ROLE[lang];

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
        const temps = RUMOR_TEMPLATES[lang] || RUMOR_TEMPLATES['es'];
        const hooks = PLOT_HOOKS[lang] || PLOT_HOOKS['es'];

        const templateIndex = Math.floor(Math.random() * temps.length);
        const hookIndex = Math.floor(Math.random() * hooks.length);

        let rumorText = temps[templateIndex];
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = hooks[hookIndex];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
