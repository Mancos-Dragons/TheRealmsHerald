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
                    "Se dice que", "Algunos murmuran que", "Dicen las malas lenguas que",
                    "Es un secreto a voces que", "Un mercader forastero jura que",
                    "Un guardia borracho mencionó que", "Los niños del pueblo cantan que"
                ],
                subjects: [
                    "{npcName}, el {npcRole}",
                    "el misterioso {npcRole} conocido como {npcName}",
                    "nuestro estimado {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros a medianoche",
                    "sabe dónde está el tesoro perdido, pero tiene demasiado miedo para hablar",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "está fabricando venenos para un asesino",
                    "hizo un pacto con una entidad de otro plano",
                    "es el heredero perdido de una nobleza caída",
                    "habla con criaturas que nadie más puede ver",
                    "no tiene sombra al mediodía",
                    "guarda una reliquia maldita en su sótano"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en las catacumbas bajo {townName}.",
                    "justo a las afueras de {townName}.",
                    "en las sombras de {townName}.",
                    "en un pozo abandonado de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ]
            },
            en: {
                intros: [
                    "It is said that", "Some whisper that", "Rumor has it that",
                    "It's an open secret that", "A traveling merchant swears that",
                    "A drunk guard mentioned that", "The local children sing that"
                ],
                subjects: [
                    "{npcName}, the {npcRole}",
                    "the mysterious {npcRole} known as {npcName}",
                    "our esteemed {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals at midnight",
                    "knows where the lost treasure is, but is too afraid to speak",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is actually a spy",
                    "is brewing poisons for an assassin",
                    "made a pact with an entity from another plane",
                    "is the lost heir to a fallen nobility",
                    "speaks with creatures no one else can see",
                    "casts no shadow at noon",
                    "keeps a cursed relic in their basement"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the catacombs beneath {townName}.",
                    "just outside {townName}.",
                    "in the shadows of {townName}.",
                    "in an abandoned well of {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap."
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

            const userPrompt = `Ciudad/Pueblo: ${town}
PNJ: ${name}
Rol del PNJ: ${role}`;

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

        let rumorText = `${intro} ${subject} ${action}`;

        // Optionally append location if townName was provided or just 50% of the time
        if (townName || Math.random() > 0.5) {
            const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];
            rumorText += ` ${location}`;
        } else {
            rumorText += ".";
        }

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookIndex = Math.floor(Math.random() * grammar.hooks.length);
        const hookText = grammar.hooks[hookIndex];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
