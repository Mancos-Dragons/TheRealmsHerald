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
                    "Nadie confía cuando se trata de que",
                    "Los niños dicen que",
                    "Un guardia asegura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (nuestro {npcRole}),",
                    "ese tal {npcName}, que trabaja como {npcRole},",
                    "el misterioso {npcName}, conocido {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está invocando fuerzas que no comprende",
                    "fue visto desenterrando algo",
                    "hizo un pacto con un demonio",
                    "escala por las paredes como una araña",
                    "tiene un hermano gemelo malvado escondido"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en las afueras de {townName}.",
                    "en el cementerio de {townName}.",
                    "bajo las calles de {townName}.",
                    "en la plaza central de {townName} a medianoche.",
                    "en la taberna de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área en {townName}, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: {npcName} negará todo rotundamente si se le presiona, pero su diario contiene pistas.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre {npcName} en la taberna.",
                    "Gancho de Aventura: El rumor es una trampa planeada por {npcName} para emboscar aventureros incautos.",
                    "Gancho de Aventura: El gremio local de {townName} ofrece oro si los aventureros confirman este chisme."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "There were strange noises last night and they think",
                    "Word around is that",
                    "There are rumors that",
                    "Nobody trusts when it comes to the fact that",
                    "The children say that",
                    "A guard swears he saw that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (our {npcRole}),",
                    "that {npcName}, working as a {npcRole},",
                    "the mysterious {npcName}, known {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is summoning forces they don't understand",
                    "was seen digging something up",
                    "made a pact with a demon",
                    "climbs the walls like a spider",
                    "has an evil twin brother hidden away"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the cemetery of {townName}.",
                    "beneath the streets of {townName}.",
                    "in the central square of {townName} at midnight.",
                    "in the tavern of {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area in {townName}, they will find mysterious footprints.",
                    "Plot Hook: {npcName} will strongly deny everything if pressed, but their diary contains vital clues.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about {npcName} in the tavern.",
                    "Plot Hook: The rumor is a trap planned by {npcName} to ambush unwary adventurers.",
                    "Plot Hook: The local guild of {townName} offers gold if the adventurers confirm this gossip."
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
        const grammarLang = this.grammar[lang] || this.grammar['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pickRandom(grammarLang.intros);
        const subject = pickRandom(grammarLang.subjects);
        const action = pickRandom(grammarLang.actions);
        const location = pickRandom(grammarLang.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = pickRandom(grammarLang.hooks);
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
