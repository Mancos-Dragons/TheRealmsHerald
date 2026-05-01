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
                    "Un viajero que pasó por {townName} asegura que",
                    "Es un secreto a voces en {townName} que"
                ],
                subjects: [
                    " {npcName}, nuestro querido {npcRole},",
                    " {npcName}, conocido por ser un {npcRole},",
                    " el mismísimo {npcName}, que trabaja de {npcRole},"
                ],
                actions: [
                    " fue visto haciendo tratos oscuros",
                    " esconde un tesoro maldito",
                    " ha estado invocando fuerzas extrañas",
                    " es en realidad un espía del reino vecino"
                ],
                locations: [
                    " cerca del viejo cementerio.",
                    " en las profundidades del bosque.",
                    " bajo la taberna.",
                    " en las ruinas olvidadas."
                ],
                hooks: [
                    "Los PJs pueden investigar el lugar mencionado en {townName} y enfrentarse a lo que sea que {npcName} (el {npcRole}) haya despertado.",
                    "{npcName} contrata a los PJs en secreto para recuperar algo que perdió, antes de que los rumores en {townName} se salgan de control.",
                    "La guardia local de {townName} busca aventureros para seguir a {npcName} y confirmar o desmentir el rumor de este {npcRole}."
                ]
            },
            en: {
                intros: [
                    "Word around {townName} is that",
                    "Whispers in {townName} suggest that",
                    "A traveler passing through {townName} claims that",
                    "It's an open secret in {townName} that"
                ],
                subjects: [
                    " {npcName}, our beloved {npcRole},",
                    " {npcName}, known for being a {npcRole},",
                    " {npcName} themselves, who works as a {npcRole},"
                ],
                actions: [
                    " was seen making shady deals",
                    " is hiding a cursed treasure",
                    " has been summoning strange forces",
                    " is actually a spy from the neighboring kingdom"
                ],
                locations: [
                    " near the old graveyard.",
                    " deep in the woods.",
                    " beneath the tavern.",
                    " in the forgotten ruins."
                ],
                hooks: [
                    "The party can investigate the mentioned location in {townName} and confront whatever {npcName} (the {npcRole}) has awakened.",
                    "{npcName} secretly hires the party to retrieve something they lost, before the rumors in {townName} get out of hand.",
                    "The local guard of {townName} is looking for adventurers to tail {npcName} and confirm or debunk the rumor about this {npcRole}."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];

        let rumorText = intro + subject + action + location;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
