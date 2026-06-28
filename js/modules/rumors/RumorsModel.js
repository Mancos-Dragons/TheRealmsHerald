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
                    "Nadie confía y se rumorea que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "aquel {npcRole} de {townName}, llamado {npcName},",
                    "{npcName} (el {npcRole} en {townName})"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "fue visto desenterrando algo",
                    "está fabricando venenos"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en los bajos fondos.",
                    "en la taberna local.",
                    "cerca de la plaza central."
                ],
                hooks: [
                    "Los jugadores podrían investigar el bosque viejo para buscar pruebas del trato de {npcName}.",
                    "El {npcRole} podría intentar vender un mapa del tesoro falso a los aventureros en {townName}.",
                    "Las fuerzas invocadas empiezan a corromper el agua de {townName}. Los jugadores deben detenerlo.",
                    "Los jugadores son contratados para seguir a {npcName} y descubrir para quién trabaja realmente."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Last night there were strange noises and they believe that",
                    "Rumor has it that",
                    "There are rumors that",
                    "No one trusts and it is rumored that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "that {npcRole} of {townName}, named {npcName},",
                    "{npcName} (the {npcRole} in {townName})"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is a spy",
                    "was seen digging something up",
                    "is brewing poisons"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old cemetery.",
                    "in the slums.",
                    "at the local tavern.",
                    "near the central plaza."
                ],
                hooks: [
                    "Players might investigate the old forest to look for evidence of {npcName}'s deal.",
                    "The {npcRole} could try to sell a fake treasure map to the adventurers in {townName}.",
                    "The summoned forces are starting to corrupt the water in {townName}. Players must stop it.",
                    "Players are hired to follow {npcName} and discover who they are really working for."
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

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
