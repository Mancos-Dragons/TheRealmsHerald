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
                    "Se dice en {townName} que",
                    "Las malas lenguas en {townName} murmuran que",
                    "Anoche hubo rumores en {townName} de que",
                    "En la taberna de {townName} se susurra que",
                    "Los niños de {townName} comentan que",
                    "Nadie en {townName} deja de hablar sobre cómo"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "ese misterioso {npcRole} llamado {npcName},",
                    "{npcName} (nuestro {npcRole}),",
                    "el {npcRole} conocido como {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está invocando fuerzas que no comprende",
                    "desenterró algo extraño",
                    "fue visto bebiendo sangre de un cáliz profano",
                    "está fabricando venenos para un asesino",
                    "se desvaneció en las sombras",
                    "hizo un pacto con un demonio",
                    "ofreció un mapa hacia una ciudad de oro escondida"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las afueras del pueblo.",
                    "durante su ronda nocturna.",
                    "en una cueva olvidada.",
                    "cerca del río.",
                    "en su sótano oscuro."
                ],
                hooks: [
                    "DM Note: El personaje realmente encontró un artefacto maldito que está atrayendo monstruos al pueblo.",
                    "DM Note: Todo es un malentendido, pero un grupo de aventureros rivales ya está investigando y podría causar problemas.",
                    "DM Note: El personaje está siendo chantajeado por un culto local para realizar estas acciones.",
                    "DM Note: El personaje es en realidad un dragón polimorfizado que perdió su memoria.",
                    "DM Note: Las acciones del personaje son una tapadera para proteger al heredero legítimo del reino."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "Rumors in {townName} suggest that",
                    "Last night there were whispers in {townName} that",
                    "At the tavern in {townName}, everyone is talking about how",
                    "The children of {townName} claim that",
                    "Nobody in {townName} can stop talking about how"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "that mysterious {npcRole} named {npcName},",
                    "{npcName} (our {npcRole}),",
                    "the {npcRole} known as {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is summoning forces they do not understand",
                    "unearthed something strange",
                    "was seen drinking blood from an unholy chalice",
                    "is brewing poisons for an assassin",
                    "vanished into the shadows",
                    "made a pact with a crossroads demon",
                    "offered a map to a hidden city of gold"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old cemetery.",
                    "on the outskirts of town.",
                    "during their night patrol.",
                    "in a forgotten cave.",
                    "near the river.",
                    "in their dark basement."
                ],
                hooks: [
                    "DM Note: The character actually found a cursed artifact that is attracting monsters to the town.",
                    "DM Note: It is all a misunderstanding, but a rival adventuring party is already investigating and might cause trouble.",
                    "DM Note: The character is being blackmailed by a local cult to perform these actions.",
                    "DM Note: The character is actually a polymorphed dragon who lost their memory.",
                    "DM Note: The character's actions are a cover-up to protect the rightful heir to the kingdom."
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
