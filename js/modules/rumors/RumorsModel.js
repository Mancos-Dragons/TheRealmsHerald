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
                    "Anoche hubo ruidos y dicen que",
                    "Dicen las malas lenguas que",
                    "Nadie lo confirma, pero se comenta que",
                    "Se rumorea por ahí que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (nuestro {npcRole} en {townName})",
                    "ese tal {npcName}, que trabaja de {npcRole} aquí en {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "es en realidad un espía del reino vecino",
                    "está fabricando venenos mortales",
                    "hizo un pacto con un demonio",
                    "colecciona almas en frascos de cristal"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las sombras del callejón.",
                    "en su sótano secreto.",
                    "en las ruinas a las afueras.",
                    "lejos de la vista de la guardia."
                ],
                hooks: [
                    "Los PJs pueden encontrar huellas sospechosas cerca del lugar.",
                    "Un PNJ ofrece una recompensa si descubren la verdad.",
                    "Los jugadores son atacados por matones si investigan demasiado.",
                    "Encuentran un mapa codificado que confirma las sospechas.",
                    "El rumor es falso, pero alguien lo esparció para encubrir un crimen real."
                ]
            },
            en: {
                intros: [
                    "Rumor has it that",
                    "Some whisper that",
                    "There were noises last night and they say that",
                    "Word on the street is that",
                    "No one confirms it, but it's said that",
                    "People are saying that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} (our {npcRole} in {townName})",
                    "that {npcName}, who works as a {npcRole} here in {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is actually a spy from the neighboring kingdom",
                    "is crafting deadly poisons",
                    "made a pact with a demon",
                    "collects souls in glass jars"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old cemetery.",
                    "in the shadows of the alley.",
                    "in their secret basement.",
                    "in the ruins on the outskirts.",
                    "away from the guards' sight."
                ],
                hooks: [
                    "The PCs might find suspicious tracks near the location.",
                    "An NPC offers a reward if they uncover the truth.",
                    "The players are attacked by thugs if they investigate too much.",
                    "They find a coded map confirming the suspicions.",
                    "The rumor is false, but someone spread it to cover up a real crime."
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

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        let subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];
        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        const rumorText = `${intro} ${subject} ${action} ${location}`;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
