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
                    "Dicen las malas lenguas que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "ese tal {npcName} (nuestro {npcRole}),",
                    "el misterioso {npcName}, que trabaja como {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está invocando fuerzas extrañas",
                    "esconde un artefacto robado",
                    "está planeando una traición"
                ],
                locations: [
                    "cerca del bosque de {townName}.",
                    "en los callejones de {townName}.",
                    "fuera de la vista de todos.",
                    "en un sótano abandonado."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan, encontrarán huellas que llevan a una cueva.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival. El rival ofrecerá oro si lo confirman.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Last night I heard that",
                    "Rumor has it that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "that {npcName} (our {npcRole}),",
                    "the mysterious {npcName}, who works as a {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is summoning strange forces",
                    "is hiding a stolen artifact",
                    "is planning a betrayal"
                ],
                locations: [
                    "near the forest of {townName}.",
                    "in the alleys of {townName}.",
                    "out of everyone's sight.",
                    "in an abandoned basement."
                ],
                hooks: [
                    "Plot Hook: If the players investigate, they will find footprints leading to a cave.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is a misunderstanding created by a rival. The rival offers gold if confirmed.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor."
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

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pickRandom(grammar.intros)} ${pickRandom(grammar.subjects)} ${pickRandom(grammar.actions)} ${pickRandom(grammar.locations)}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(grammar.hooks);

        return {
            rumor: rumorText.trim(),
            hook: hookText
        };
    }
}
