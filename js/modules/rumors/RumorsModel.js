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
                    "Anoche escuché que",
                    "Un mercader forastero jura que",
                    "Dicen las malas lenguas que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "el infame {npcRole} conocido como {npcName} de {townName}",
                    "nuestro querido {npcRole}, {npcName}, quien vive en {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "fue atrapado desenterrando algo extraño"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el cementerio abandonado.",
                    "bajo las ruinas del castillo.",
                    "en los sótanos de la taberna.",
                    "en las afueras, donde nadie vigila."
                ],
                hooks: [
                    "Los PJs pueden encontrar huellas frescas en el lugar.",
                    "Un objeto extraño fue dejado atrás como pista.",
                    "Alguien más está investigando esto y advierte a los PJs.",
                    "El PNJ ofrece oro para que los PJs mantengan el secreto.",
                    "Una facción oscura ya está en movimiento."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Last night I heard that",
                    "A traveling merchant swears that",
                    "Rumor has it that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "the infamous {npcRole} known as {npcName} from {townName}",
                    "our dear {npcRole}, {npcName}, who lives in {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is a spy",
                    "was caught digging up something strange"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the abandoned graveyard.",
                    "beneath the castle ruins.",
                    "in the tavern's cellars.",
                    "on the outskirts, where no one watches."
                ],
                hooks: [
                    "The PCs can find fresh tracks at the location.",
                    "A strange object was left behind as a clue.",
                    "Someone else is investigating this and warns the PCs.",
                    "The NPC offers gold for the PCs to keep the secret.",
                    "A dark faction is already on the move."
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

        const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomElement(grammar.intros);
        const subject = randomElement(grammar.subjects);
        const action = randomElement(grammar.actions);
        const location = randomElement(grammar.locations);
        const hook = randomElement(grammar.hooks);

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