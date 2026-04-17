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
                    "Se dice que", "Algunos murmuran que", "Anoche hubo ruidos extraños, dicen que",
                    "Dicen las malas lenguas que", "Un guardia asegura que", "Un mercader forastero jura que",
                    "En la taberna se susurra que", "Nadie sabe por qué, pero cuentan que"
                ],
                subjects: [
                    "{npcName}, el {npcRole}", "el mismísimo {npcName} ({npcRole})", "ese tal {npcName}, nuestro {npcRole}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros", "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende", "no es quien dice ser y es un espía",
                    "fue visto desenterrando algo", "hizo un pacto con un demonio",
                    "habla con los árboles y estos le responden", "se desvaneció en las sombras",
                    "puede hacer que cualquiera desaparezca"
                ],
                locations: [
                    "cerca del bosque viejo", "en {townName}", "en el viejo cementerio",
                    "cerca de la encrucijada", "a las afueras de {townName}", "en los callejones oscuros"
                ],
                hooks: [
                    "Gancho de Aventura: El PNJ en realidad es inocente, pero alguien está usando magia de ilusión para inculparlo.",
                    "Gancho de Aventura: El rumor es cierto. El PNJ necesita la ayuda de los aventureros para completar un ritual antes de la próxima luna.",
                    "Gancho de Aventura: El PNJ esconde un mapa antiguo en su casa que lleva a unas ruinas olvidadas bajo la ciudad.",
                    "Gancho de Aventura: El rumor fue iniciado por un rival comercial del PNJ para arruinar su reputación.",
                    "Gancho de Aventura: Investigar al PNJ revela que forma parte de un culto secreto que opera desde hace generaciones.",
                    "Gancho de Aventura: El PNJ ha sido reemplazado por un Doppelgänger. El original está atrapado en un sótano."
                ]
            },
            en: {
                intros: [
                    "Word is that", "Some whisper that", "There were strange noises last night, they say",
                    "Rumor has it that", "A guard claims that", "A traveling merchant swears that",
                    "At the tavern they whisper that", "Nobody knows why, but they tell that"
                ],
                subjects: [
                    "{npcName}, the {npcRole}", "the very {npcName} ({npcRole})", "that {npcName}, our {npcRole}"
                ],
                actions: [
                    "was seen making dark deals", "knows where a lost treasure is",
                    "is summoning forces they do not understand", "is not who they claim to be and is a spy",
                    "was seen digging something up", "made a pact with a demon",
                    "speaks to the trees and they answer back", "vanished into the shadows",
                    "can make anyone disappear"
                ],
                locations: [
                    "near the old forest", "in {townName}", "in the old graveyard",
                    "near the crossroads", "on the outskirts of {townName}", "in the dark alleys"
                ],
                hooks: [
                    "Adventure Hook: The NPC is actually innocent, but someone is using illusion magic to frame them.",
                    "Adventure Hook: The rumor is true. The NPC needs the adventurers' help to complete a ritual before the next moon.",
                    "Adventure Hook: The NPC is hiding an ancient map in their house that leads to forgotten ruins beneath the city.",
                    "Adventure Hook: The rumor was started by a business rival of the NPC to ruin their reputation.",
                    "Adventure Hook: Investigating the NPC reveals they are part of a secret cult that has been operating for generations.",
                    "Adventure Hook: The NPC has been replaced by a Doppelgänger. The real one is trapped in a basement."
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

        // Procedural generation
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];

        let rumorText = `${intro} ${subject} ${action}`;

        // Optionally add a location (50% chance)
        if (Math.random() > 0.5) {
            const location = g.locations[Math.floor(Math.random() * g.locations.length)];
            rumorText += ` ${location}`;
        }

        rumorText += ".";

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
