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
                    "Se dice en las calles que ",
                    "He escuchado murmullos sobre que ",
                    "Corre el rumor de que ",
                    "Dicen las malas lenguas que "
                ],
                subjects: [
                    "{npcName}, el {npcRole}, ",
                    "el infame {npcRole} conocido como {npcName}, ",
                    "nadie menos que {npcName}, nuestro {npcRole}, "
                ],
                actions: [
                    "fue visto haciendo tratos oscuros a medianoche ",
                    "esconde un secreto terrible relacionado con la nobleza ",
                    "encontró un artefacto antiguo y maldito ",
                    "está conspirando en las sombras con fuerzas oscuras "
                ],
                locations: [
                    "cerca del viejo pozo de {townName}.",
                    "en los callejones más oscuros de {townName}.",
                    "a las afueras de {townName}.",
                    "en las catacumbas debajo de {townName}."
                ],
                hooks: [
                    "Los jugadores podrían investigar el lugar mencionado a medianoche.",
                    "El PNJ buscará a los jugadores para pedirles ayuda antes de que se descubra su secreto.",
                    "Alguien ha puesto un precio a la cabeza del PNJ por este mismo rumor.",
                    "El artefacto mencionado está atrayendo monstruos a la zona."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that ",
                    "I've heard whispers that ",
                    "Rumor has it that ",
                    "They say that "
                ],
                subjects: [
                    "{npcName}, the {npcRole}, ",
                    "the infamous {npcRole} known as {npcName}, ",
                    "none other than {npcName}, our {npcRole}, "
                ],
                actions: [
                    "was seen making dark deals at midnight ",
                    "hides a terrible secret related to the nobility ",
                    "found an ancient, cursed artifact ",
                    "is conspiring in the shadows with dark forces "
                ],
                locations: [
                    "near the old well of {townName}.",
                    "in the darkest alleys of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the catacombs beneath {townName}."
                ],
                hooks: [
                    "The players could investigate the mentioned place at midnight.",
                    "The NPC will seek the players' help before their secret is exposed.",
                    "Someone has put a bounty on the NPC's head because of this rumor.",
                    "The mentioned artifact is drawing monsters to the area."
                ]
            }
        };
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';

        const town = townName || this.defaultTown[lang] || this.defaultTown['es'];
        const name = npcName || this.defaultNpcName[lang] || this.defaultNpcName['es'];
        const role = npcRole || this.defaultNpcRole[lang] || this.defaultNpcRole['es'];

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
                    if (jsonText.startsWith('\`\`\`json')) {
                        jsonText = jsonText.replace(/^\`\`\`json/m, '').replace(/\`\`\`$/m, '').trim();
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

        let rumorText = intro + subject + action + location;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
