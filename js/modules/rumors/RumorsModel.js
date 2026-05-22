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
                    "Se dice en las calles de {townName} que",
                    "Un mercader forastero llegó a {townName} jurando que",
                    "Las malas lenguas en {townName} murmuran que",
                    "Nadie quiere hablar en voz alta en {townName}, pero es un secreto a voces que",
                    "Los niños de {townName} cantan una canción sobre que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro {npcRole}, {npcName},",
                    "ese extraño {npcRole} llamado {npcName}",
                    "el infame {npcRole} de la ciudad, {npcName},"
                ],
                actions: [
                    "hizo un pacto con un demonio de encrucijada",
                    "encontró un mapa que lleva a un tesoro olvidado",
                    "es en realidad un noble exiliado",
                    "está reuniendo un ejército en secreto",
                    "robó una reliquia sagrada del templo",
                    "fue visto enterrando un cofre manchado de sangre",
                    "fabrica venenos para el gremio de asesinos"
                ],
                locations: [
                    "en el viejo cementerio.",
                    "cerca del bosque oscuro.",
                    "en las catacumbas debajo del castillo.",
                    "en las afueras de la ciudad.",
                    "en una cueva oculta en las montañas.",
                    "en el sótano de la taberna."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas y la entrada a una mazmorra secreta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario o un mensaje a medio quemar revelarán la verdad.",
                    "Gancho de Aventura: Esto es una trampa diseñada por un rival para arruinar la reputación del PNJ. El rival pagará por confirmarlo.",
                    "Gancho de Aventura: El rumor es cierto, pero el PNJ está siendo chantajeado para hacerlo. Pedirá ayuda a los aventureros en secreto.",
                    "Gancho de Aventura: Investigar esto pondrá a los jugadores en la mira de un peligroso culto local que protege al PNJ."
                ]
            },
            en: {
                intros: [
                    "Word on the streets of {townName} is that",
                    "A foreign merchant arrived in {townName} swearing that",
                    "Idle gossip in {townName} suggests that",
                    "No one wants to speak out loud in {townName}, but it is an open secret that",
                    "The children of {townName} sing a nursery rhyme about how"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our {npcRole}, {npcName},",
                    "that strange {npcRole} named {npcName}",
                    "the infamous {npcRole} of the city, {npcName},"
                ],
                actions: [
                    "made a pact with a crossroads demon",
                    "found a map leading to a forgotten treasure",
                    "is actually an exiled noble",
                    "is secretly gathering an army",
                    "stole a sacred relic from the temple",
                    "was seen burying a bloodstained chest",
                    "brews poisons for the assassins' guild"
                ],
                locations: [
                    "in the old graveyard.",
                    "near the dark woods.",
                    "in the catacombs beneath the castle.",
                    "on the outskirts of town.",
                    "in a hidden cave in the mountains.",
                    "in the tavern's cellar."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints and the entrance to a secret dungeon.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary or a half-burned message will reveal the truth.",
                    "Plot Hook: This is a trap designed by a rival to ruin the NPC's reputation. The rival will pay to confirm it.",
                    "Plot Hook: The rumor is true, but the NPC is being blackmailed into it. They will secretly ask the adventurers for help.",
                    "Plot Hook: Investigating this will put the players in the crosshairs of a dangerous local cult that protects the NPC."
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

        let intro = randomElement(grammar.intros);
        let subject = randomElement(grammar.subjects);
        let action = randomElement(grammar.actions);
        let location = randomElement(grammar.locations);
        let hook = randomElement(grammar.hooks);

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hook
        };
    }
}
