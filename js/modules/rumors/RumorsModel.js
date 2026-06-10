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
                    "Dicen las malas lenguas que",
                    "Un mercader forastero jura que",
                    "Es un secreto a voces que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro {npcRole} en {townName}, {npcName},",
                    "ese extraño de {townName} llamado {npcName}, que dice ser {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido de {townName}",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y en realidad es un espía",
                    "está fabricando venenos"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el callejón detrás de la taberna.",
                    "en el viejo cementerio.",
                    "en las catacumbas de {townName}.",
                    "afuera de la ciudad."
                ],
                hooks: [
                    "DM Notes: Los jugadores podrían investigar la zona mencionada a medianoche para atrapar al PNJ con las manos en la masa.",
                    "DM Notes: El PNJ fue incriminado y necesita ayuda para limpiar su nombre.",
                    "DM Notes: Hay un mapa escondido en la casa del PNJ que revela más detalles.",
                    "DM Notes: El 'contacto' del PNJ es en realidad una criatura peligrosa disfrazada."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it that",
                    "A traveling merchant swears that",
                    "It's an open secret that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "our local {npcRole} in {townName}, {npcName},",
                    "that stranger in {townName} named {npcName}, who claims to be a {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure of {townName} is",
                    "is summoning forces they don't understand",
                    "is not who they say they are and is actually a spy",
                    "is brewing poisons"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the alley behind the tavern.",
                    "in the old graveyard.",
                    "in the catacombs of {townName}.",
                    "outside the city."
                ],
                hooks: [
                    "DM Notes: Players could investigate the mentioned area at midnight to catch the NPC red-handed.",
                    "DM Notes: The NPC was framed and needs help to clear their name.",
                    "DM Notes: There is a hidden map in the NPC's house that reveals more details.",
                    "DM Notes: The NPC's 'contact' is actually a dangerous creature in disguise."
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
        const grammar = this.grammar[lang] || this.grammar['es'];

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];
        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
