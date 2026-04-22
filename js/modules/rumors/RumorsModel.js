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
                    "Es un secreto a voces que",
                    "He escuchado en la plaza que",
                    "Dicen las malas lenguas que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "aquel {npcRole} llamado {npcName},",
                    "nuestro querido {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un gran tesoro",
                    "está invocando fuerzas oscuras",
                    "esconde una terrible maldición",
                    "planea traicionar a la ciudad"
                ],
                locations: [
                    "cerca del bosque viejo",
                    "en las afueras de {townName}",
                    "en las catacumbas bajo {townName}",
                    "en su propia casa"
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan, encontrarán rastros inquietantes.",
                    "Gancho de Aventura: El PNJ lo negará todo, pero su diario oculta la verdad.",
                    "Gancho de Aventura: Todo es una trampa urdida por un rival para arruinar su reputación.",
                    "Gancho de Aventura: Los rumores son ciertos, el PNJ necesita ayuda desesperadamente.",
                    "Gancho de Aventura: Los aventureros podrían ser atacados por matones si hacen demasiadas preguntas."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "It's an open secret that",
                    "I heard in the square that",
                    "Rumor has it that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "that {npcRole} named {npcName},",
                    "our dear {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a great treasure lies",
                    "is summoning dark forces",
                    "hides a terrible curse",
                    "plans to betray the city"
                ],
                locations: [
                    "near the old forest",
                    "on the outskirts of {townName}",
                    "in the catacombs beneath {townName}",
                    "in their own home"
                ],
                hooks: [
                    "Plot Hook: If the players investigate, they will find disturbing tracks.",
                    "Plot Hook: The NPC will deny everything, but their diary hides the truth.",
                    "Plot Hook: It's all a trap set by a rival to ruin their reputation.",
                    "Plot Hook: The rumors are true, the NPC desperately needs help.",
                    "Plot Hook: The adventurers might be attacked by thugs if they ask too many questions."
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

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = pickRandom(g.intros);
        let subject = pickRandom(g.subjects);
        let action = pickRandom(g.actions);
        let location = pickRandom(g.locations);
        let hook = pickRandom(g.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}.`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = hook;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
