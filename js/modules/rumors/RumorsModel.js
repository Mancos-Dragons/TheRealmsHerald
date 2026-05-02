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
                    "Se dice en {townName} que",
                    "Las malas lenguas de {townName} murmuran que",
                    "Un mercader forastero llegó a {townName} jurando que",
                    "Nadie en {townName} puede dejar de hablar de cómo"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro respetado {npcRole}, {npcName},",
                    "ese extraño {npcRole} llamado {npcName}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "esconde un tesoro maldito",
                    "está invocando fuerzas que no comprende",
                    "está fabricando venenos mortales",
                    "hizo un pacto con un demonio"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las sombras del callejón.",
                    "en la taberna local.",
                    "bajo las ruinas del castillo."
                ],
                hooks: [
                    "El PNJ ofrece una recompensa para limpiar su nombre.",
                    "Los aventureros encuentran un mapa en la escena del supuesto evento.",
                    "Un rival del PNJ contrata a los jugadores para investigar la veracidad del rumor.",
                    "El PNJ desaparece misteriosamente y la última vez fue visto en ese lugar.",
                    "Extrañas criaturas comienzan a aparecer en la zona mencionada."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "The gossips of {townName} whisper that",
                    "A foreign merchant arrived in {townName} swearing that",
                    "Nobody in {townName} can stop talking about how"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our respected {npcRole}, {npcName},",
                    "that strange {npcRole} named {npcName}"
                ],
                actions: [
                    "was seen making dark deals",
                    "is hiding a cursed treasure",
                    "is summoning forces they do not understand",
                    "is brewing deadly poisons",
                    "made a pact with a demon"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old graveyard.",
                    "in the shadows of the alley.",
                    "at the local tavern.",
                    "under the castle ruins."
                ],
                hooks: [
                    "The NPC offers a reward to clear their name.",
                    "The adventurers find a map at the scene of the supposed event.",
                    "A rival of the NPC hires the players to investigate the truth of the rumor.",
                    "The NPC disappears mysteriously and was last seen in that location.",
                    "Strange creatures start appearing in the mentioned area."
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
        const hookTemplate = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hookTemplate;
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
