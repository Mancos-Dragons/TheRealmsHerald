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
                    "Se dice que ",
                    "Algunos murmuran que ",
                    "Anoche hubo ruidos extraños, creen que ",
                    "Dicen las malas lenguas que "
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName}, ",
                    "nuestro conocido {npcName}, el {npcRole} que vive en {townName}, "
                ],
                actions: [
                    "fue visto haciendo tratos oscuros ",
                    "sabe dónde está un tesoro perdido ",
                    "está invocando fuerzas oscuras ",
                    "se desvaneció entre las sombras "
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en los callejones detrás de la taberna.",
                    "en las ruinas a las afueras."
                ],
                hooks: [
                    "Investiga el lugar a medianoche.",
                    "Busca pistas en la casa del PNJ.",
                    "Sigue al PNJ para ver con quién se encuentra.",
                    "Habla con los guardias sobre movimientos sospechosos."
                ]
            },
            en: {
                intros: [
                    "It is said that ",
                    "Some whisper that ",
                    "There were strange noises last night, they believe that ",
                    "Rumor has it that "
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName}, ",
                    "our known {npcName}, the {npcRole} who lives in {townName}, "
                ],
                actions: [
                    "was seen making shady deals ",
                    "knows where a lost treasure is ",
                    "is summoning dark forces ",
                    "vanished into the shadows "
                ],
                locations: [
                    "near the old forest at midnight.",
                    "at the old graveyard.",
                    "in the alleys behind the tavern.",
                    "at the ruins on the outskirts."
                ],
                hooks: [
                    "Investigate the location at midnight.",
                    "Search for clues in the NPC's house.",
                    "Follow the NPC to see who they meet.",
                    "Talk to the guards about suspicious movements."
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

        let rumorText = `${intro}${subject}${action}${location}`;
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
