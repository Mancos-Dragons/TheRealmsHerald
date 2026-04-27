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
                    "Se dice que ",
                    "Algunos murmuran que ",
                    "Anoche hubo ruidos extraños cuando ",
                    "Dicen las malas lenguas que ",
                    "En la última luna llena, se vio que ",
                    "Nadie confía en que ",
                    "Se rumorea en las calles que ",
                    "Los guardias aseguran que ",
                    "Las cosechas se han echado a perder desde que ",
                    "En la taberna local se susurra que "
                ],
                subjects: [
                    "{npcName}, el {npcRole}, ",
                    "{npcName} (nuestro querido {npcRole}) ",
                    "aquel llamado {npcName}, quien trabaja de {npcRole}, "
                ],
                actions: [
                    "hizo un pacto con un demonio de encrucijada ",
                    "está invocando fuerzas oscuras que no comprende ",
                    "fue visto haciendo tratos sospechosos ",
                    "está escondiendo el tesoro perdido de la ciudad ",
                    "en realidad es un espía del reino vecino ",
                    "se desvaneció entre las sombras sin dejar rastro ",
                    "fabricaba venenos letales para un asesino ",
                    "bebió sangre de un cáliz profano ",
                    "es el heredero perdido de una nobleza caída ",
                    "habla con los árboles y estos le responden "
                ],
                locations: [
                    "cerca del viejo bosque de {townName}.",
                    "en las catacumbas secretas de {townName}.",
                    "justo en el centro de {townName}.",
                    "en el viejo cementerio de {townName}.",
                    "a las afueras de {townName}.",
                    "bajo la mansión principal de {townName}.",
                    "en las alcantarillas de {townName}."
                ],
                hooks: [
                    "El jugador podría encontrar una pista de este pacto si investiga la casa del PNJ de noche.",
                    "La guardia local está buscando voluntarios para investigar estos extraños sucesos.",
                    "Un rival del PNJ ofrece una buena recompensa por pruebas que confirmen este rumor.",
                    "El rumor es falso, plantado por un gremio de ladrones para distraer a las autoridades.",
                    "Alguien dejó caer un misterioso mapa que lleva exactamente a donde ocurrió esto.",
                    "El PNJ está pidiendo ayuda desesperadamente porque el rumor ha arruinado su negocio.",
                    "Una secta secreta ha empezado a seguir al PNJ creyendo que es su profeta.",
                    "Los aventureros son contratados para escoltar al PNJ fuera de la ciudad antes de que lo linchen."
                ]
            },
            en: {
                intros: [
                    "It is said that ",
                    "Some whisper that ",
                    "Last night there were strange noises when ",
                    "Rumor has it that ",
                    "During the last full moon, it was seen that ",
                    "Nobody trusts that ",
                    "Word on the street is that ",
                    "The guards claim that ",
                    "Crops have been rotting ever since ",
                    "In the local tavern they whisper that "
                ],
                subjects: [
                    "{npcName}, the {npcRole}, ",
                    "{npcName} (our beloved {npcRole}) ",
                    "the one called {npcName}, who works as a {npcRole}, "
                ],
                actions: [
                    "made a pact with a crossroads demon ",
                    "is summoning dark forces they cannot comprehend ",
                    "was seen making suspicious deals ",
                    "is hiding the town's lost treasure ",
                    "is actually a spy from the neighboring kingdom ",
                    "vanished into the shadows without a trace ",
                    "was brewing lethal poisons for an assassin ",
                    "drank blood from an unholy chalice ",
                    "is the lost heir of a fallen nobility ",
                    "speaks to the trees and they talk back "
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the secret catacombs of {townName}.",
                    "right in the center of {townName}.",
                    "in the old cemetery of {townName}.",
                    "on the outskirts of {townName}.",
                    "under the main manor of {townName}.",
                    "in the sewers of {townName}."
                ],
                hooks: [
                    "Players might find a clue about this pact if they investigate the NPC's house at night.",
                    "The local guard is looking for volunteers to investigate these strange events.",
                    "A rival of the NPC is offering a hefty reward for proof confirming this rumor.",
                    "The rumor is false, planted by a thieves' guild to distract the authorities.",
                    "Someone dropped a mysterious map leading exactly to where this happened.",
                    "The NPC is desperately asking for help because the rumor ruined their business.",
                    "A secret cult has started following the NPC, believing them to be their prophet.",
                    "The adventurers are hired to escort the NPC out of town before they are lynched."
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
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];
        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = intro + subject + action + location;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
