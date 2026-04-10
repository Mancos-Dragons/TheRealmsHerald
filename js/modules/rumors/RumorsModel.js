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
                    "Anoche hubo ruidos extraños y creen que",
                    "Dicen las malas lenguas que",
                    "Hay rumores de que",
                    "Se rumorea que",
                    "Los niños dicen que",
                    "Un guardia asegura que",
                    "Cuenta la leyenda local que",
                    "Un forastero borracho juró que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (el {npcRole})",
                    "nuestro {npcRole}, {npcName},",
                    "{npcName}, un {npcRole} que vive cerca de {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "fue visto desenterrando algo",
                    "trajo una extraña reliquia",
                    "está fabricando venenos",
                    "hizo un pacto con un demonio",
                    "es el heredero perdido de una nobleza",
                    "habla con los árboles y le responden",
                    "se desvaneció en las sombras",
                    "tiene un mapa secreto"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "en el viejo cementerio de {townName}.",
                    "en las catacumbas debajo de la iglesia.",
                    "en su propia casa.",
                    "cerca de la encrucijada a las afueras de {townName}.",
                    "en las montañas cercanas a {townName}."
                ],
                hooks: [
                    "Investiga la casa del PNJ de noche. Podría haber guardias o trampas.",
                    "Sigue al PNJ hasta su punto de encuentro en el bosque. Prepárate para una emboscada.",
                    "Busca pistas en el cementerio. Podrías encontrar no-muertos.",
                    "Interroga al PNJ o gánate su confianza invitándole a una copa.",
                    "Encuentra el alijo secreto del PNJ, pero cuidado con las facciones rivales.",
                    "Evita que el PNJ complete un ritual peligroso esta noche.",
                    "Descubre la verdadera identidad del PNJ antes de que el pueblo lo linche por los rumores."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that",
                    "Some whisper that",
                    "Last night there were strange noises and they think",
                    "Gossip has it that",
                    "There are rumors that",
                    "It is rumored that",
                    "The children say that",
                    "A guard swears that",
                    "Local legend tells that",
                    "A drunk outsider swore that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} (the {npcRole})",
                    "our {npcRole}, {npcName},",
                    "{npcName}, a {npcRole} living near {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is a spy",
                    "was seen digging something up",
                    "brought a strange relic",
                    "is brewing poisons",
                    "made a pact with a demon",
                    "is the lost heir of a fallen nobility",
                    "talks to the trees and they talk back",
                    "vanished into the shadows",
                    "has a secret map"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "but is too afraid to speak.",
                    "in the old graveyard of {townName}.",
                    "in the catacombs beneath the church.",
                    "in their own house.",
                    "near the crossroads just outside {townName}.",
                    "in the mountains near {townName}."
                ],
                hooks: [
                    "Investigate the NPC's house at night. There might be guards or traps.",
                    "Follow the NPC to their meeting point in the forest. Prepare for an ambush.",
                    "Look for clues in the graveyard. You might encounter undead.",
                    "Interrogate the NPC or earn their trust by buying them a drink.",
                    "Find the NPC's secret stash, but beware of rival factions.",
                    "Stop the NPC from completing a dangerous ritual tonight.",
                    "Uncover the NPC's true identity before the townsfolk lynch them over the rumors."
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

        const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomElement(grammar.intros)} ${randomElement(grammar.subjects)} ${randomElement(grammar.actions)} ${randomElement(grammar.locations)}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomElement(grammar.hooks).replace(/{townName}/g, town).replace(/{npcName}/g, name).replace(/{npcRole}/g, role);

        return {
            rumor: rumorText.trim(),
            hook: hookText.trim()
        };
    }
}
