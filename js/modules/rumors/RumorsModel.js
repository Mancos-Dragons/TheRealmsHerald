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
                    "Hay rumores en {townName} de que",
                    "Un anciano en {townName} asegura que",
                    "Las malas lenguas de {townName} susurran que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "el misterioso {npcRole} llamado {npcName},",
                    "nuestro querido {npcRole}, {npcName},"
                ],
                actions: [
                    "hizo un pacto oscuro",
                    "encontró un tesoro maldito",
                    "robó una reliquia antigua",
                    "está invocando demonios",
                    "asesinó a sangre fría a un rival"
                ],
                locations: [
                    "en el cementerio local.",
                    "cerca del viejo bosque.",
                    "en los callejones traseros.",
                    "durante la última luna llena."
                ],
                hooks: [
                    "Gancho: Los jugadores pueden investigar la zona para encontrar pistas o huellas de {npcName}.",
                    "Gancho: {npcName}, el {npcRole}, pedirá ayuda a los aventureros para limpiar su nombre en {townName}.",
                    "Gancho: Un grupo de cazarrecompensas llega a {townName} buscando a {npcName} por este mismo rumor."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "There are rumors in {townName} that",
                    "An old man in {townName} swears that",
                    "The gossip in {townName} is that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "the mysterious {npcRole} named {npcName},",
                    "our beloved {npcRole}, {npcName},"
                ],
                actions: [
                    "made a dark pact",
                    "found a cursed treasure",
                    "stole an ancient relic",
                    "is summoning demons",
                    "murdered a rival in cold blood"
                ],
                locations: [
                    "at the local cemetery.",
                    "near the old forest.",
                    "in the back alleys.",
                    "during the last full moon."
                ],
                hooks: [
                    "Plot Hook: Players can investigate the area to find clues or footprints belonging to {npcName}.",
                    "Plot Hook: {npcName}, the {npcRole}, will ask the adventurers for help to clear their name in {townName}.",
                    "Plot Hook: A group of bounty hunters arrives in {townName} looking for {npcName} because of this very rumor."
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

        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = getRandom(grammar.intros);
        const subject = getRandom(grammar.subjects);
        const action = getRandom(grammar.actions);
        const location = getRandom(grammar.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        let hookText = getRandom(grammar.hooks);

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
