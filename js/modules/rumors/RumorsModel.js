import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

const DEFAULTS = {
    town: { es: "Pueblo Viejo", en: "Old Town" },
    npcName: { es: "Desconocido", en: "Unknown" },
    npcRole: { es: "Viajero", en: "Traveler" }
};

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Anoche hubo rumores de que",
                    "Un mercader forastero afirma que",
                    "Dicen las malas lenguas que",
                    "Nadie confía en",
                    "Se rumorea que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (el {npcRole})",
                    "nuestro {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser",
                    "desenterró algo inquietante",
                    "está fabricando venenos",
                    "hizo un pacto con un demonio",
                    "se desvaneció en las sombras"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en los callejones de {townName}.",
                    "en el viejo cementerio de {townName}.",
                    "cerca de la encrucijada de {townName}.",
                    "en la taberna local de {townName}."
                ],
                hooks: [
                    "Los personajes podrían investigar el bosque cerca de la ciudad para encontrar pistas.",
                    "El PNJ tiene un mapa oculto en su casa que los jugadores pueden robar o negociar.",
                    "La guardia local está buscando voluntarios para vigilar al PNJ esta noche.",
                    "Alguien más está chantajeando al PNJ por este secreto.",
                    "Los aventureros pueden ofrecerse a realizar un trabajo sucio para el PNJ a cambio de información."
                ]
            },
            en: {
                intros: [
                    "Word has it that",
                    "Some whisper that",
                    "Last night there were rumors that",
                    "A foreign merchant claims that",
                    "Gossip says that",
                    "No one trusts",
                    "Rumor has it that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} (the {npcRole})",
                    "our {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making shady deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be",
                    "unearthed something disturbing",
                    "is crafting poisons",
                    "made a pact with a demon",
                    "vanished into the shadows"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the alleys of {townName}.",
                    "in the old cemetery of {townName}.",
                    "near the crossroads of {townName}.",
                    "in the local tavern of {townName}."
                ],
                hooks: [
                    "Characters could investigate the forest near the town to find clues.",
                    "The NPC has a hidden map in their house that players can steal or bargain for.",
                    "The local guard is looking for volunteers to watch the NPC tonight.",
                    "Someone else is blackmailing the NPC over this secret.",
                    "Adventurers can offer to do dirty work for the NPC in exchange for information."
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

        const grammar = this.grammar[lang] || this.grammar['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pickRandom(grammar.intros)} ${pickRandom(grammar.subjects)} ${pickRandom(grammar.actions)} ${pickRandom(grammar.locations)}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(grammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
