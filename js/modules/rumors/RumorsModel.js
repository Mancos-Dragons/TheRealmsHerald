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
                    "Es bien sabido que",
                    "Un mercader forastero jura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "el famoso {npcRole} conocido como {npcName} en {townName},",
                    "{npcName}, quien trabaja de {npcRole} en el centro de {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y en realidad es un espía",
                    "fue visto desenterrando algo"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en los callejones más oscuros.",
                    "cerca de la encrucijada.",
                    "en las ruinas a las afueras."
                ],
                hooks: [
                    "Los PNJ locales evitarán hablar del tema a menos que sean sobornados o intimidados.",
                    "Se puede encontrar una pista en la habitación de la posada donde se hospeda el forastero.",
                    "Cualquiera que investigue más a fondo será seguido por un misterioso cuervo.",
                    "Hay un mapa oculto detrás de un cuadro en la taberna local.",
                    "Alguien ya ha intentado investigar esto y ha desaparecido misteriosamente."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it that",
                    "It is well known that",
                    "A traveling merchant swears that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "the infamous {npcRole} known as {npcName} in {townName},",
                    "{npcName}, who works as a {npcRole} in the heart of {townName},"
                ],
                actions: [
                    "was seen making shady deals",
                    "knows where the lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is actually a spy",
                    "was seen digging something up"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old graveyard.",
                    "in the darkest alleys.",
                    "near the crossroads.",
                    "in the ruins outside the gates."
                ],
                hooks: [
                    "Local NPCs will avoid talking about it unless bribed or intimidated.",
                    "A clue can be found in the inn room where the stranger is staying.",
                    "Anyone investigating further will be followed by a mysterious raven.",
                    "There is a hidden map behind a painting in the local tavern.",
                    "Someone has already tried to investigate this and has mysteriously disappeared."
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
        const langGrammar = this.grammar[lang] || this.grammar['es'];
        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pickRandom(langGrammar.intros);
        const subject = pickRandom(langGrammar.subjects);
        const action = pickRandom(langGrammar.actions);
        const location = pickRandom(langGrammar.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(langGrammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
