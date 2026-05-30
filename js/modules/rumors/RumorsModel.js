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
                    "Las malas lenguas en {townName} murmuran que",
                    "Un mercader en {townName} asegura que",
                    "La guardia de {townName} sospecha que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro respetado {npcName} ({npcRole}),",
                    "{npcName}, que trabaja como {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "encontró un artefacto maldito",
                    "está invocando fuerzas oscuras",
                    "fue visto desenterrando tumbas",
                    "es en realidad un espía encubierto"
                ],
                locations: [
                    "cerca del viejo bosque a medianoche.",
                    "en las catacumbas olvidadas.",
                    "detrás de la taberna local.",
                    "en las afueras de la muralla.",
                    "en el mercado negro."
                ],
                hooks: [
                    "El grupo podría encontrar pistas en el lugar mencionado. ¿Qué estaba buscando realmente?",
                    "El PNJ ofrece una recompensa para que se deje de hablar de él, pero tiene algo que ocultar.",
                    "Al investigar, el grupo es emboscado por individuos que protegen al PNJ.",
                    "La guardia local pide ayuda al grupo para investigar estos rumores discretamente."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "Rumors in {townName} claim that",
                    "A merchant in {townName} swears that",
                    "The guards in {townName} suspect that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our respected {npcName} ({npcRole}),",
                    "{npcName}, who works as a {npcRole},"
                ],
                actions: [
                    "was seen making shady deals",
                    "found a cursed artifact",
                    "is summoning dark forces",
                    "was seen digging up graves",
                    "is actually an undercover spy"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the forgotten catacombs.",
                    "behind the local tavern.",
                    "outside the city walls.",
                    "in the black market."
                ],
                hooks: [
                    "The party might find clues at the mentioned location. What were they really looking for?",
                    "The NPC offers a reward to stop the rumors, but they are clearly hiding something.",
                    "Upon investigating, the party is ambushed by individuals protecting the NPC.",
                    "The local guard asks the party for help to investigate these rumors discreetly."
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

        let rumorText = `${pickRandom(grammar.intros)} ${pickRandom(grammar.subjects)} ${pickRandom(grammar.actions)} ${pickRandom(grammar.locations)}`;
        let hookText = pickRandom(grammar.hooks);

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}