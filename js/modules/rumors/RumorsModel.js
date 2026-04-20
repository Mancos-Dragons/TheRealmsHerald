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
                    "Nadie quiere hablar de ello, pero se rumorea que", "Escuché en la taberna que",
                    "Es un secreto a voces que", "Se comenta por las calles que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (que trabaja como {npcRole})",
                    "ese tal {npcName}, nuestro {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y que en realidad es un espía",
                    "desapareció misteriosamente y volvió cambiado",
                    "hizo un pacto con una entidad de otro mundo",
                    "está fabricando algo peligroso en secreto"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en los alrededores de {townName}.",
                    "en las catacumbas debajo de {townName}.",
                    "lejos de las miradas en {townName}.",
                    "cuando la luna está llena."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan, encontrarán huellas misteriosas.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario tiene pistas.",
                    "Gancho de Aventura: Esto es una trampa creada por un rival del PNJ.",
                    "Gancho de Aventura: Los rumores son ciertos y se necesita intervención antes del eclipse.",
                    "Gancho de Aventura: Quien pregunte demasiado por esto será atacado por mercenarios."
                ]
            },
            en: {
                intros: [
                    "Word on the street is that", "Some whisper that", "Rumor has it that",
                    "Nobody wants to talk about it, but it's said that", "I heard at the tavern that",
                    "It's an open secret that", "People are saying that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (the local {npcRole})",
                    "that {npcName}, our {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "isn't who they say they are and is actually a spy",
                    "disappeared mysteriously and came back changed",
                    "made a pact with an otherworldly entity",
                    "is building something dangerous in secret"
                ],
                locations: [
                    "near the old woods at midnight.",
                    "on the outskirts of {townName}.",
                    "in the catacombs beneath {townName}.",
                    "away from prying eyes in {townName}.",
                    "when the moon is full."
                ],
                hooks: [
                    "Plot Hook: If the players investigate, they will find mysterious footprints.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary has clues.",
                    "Plot Hook: This is a trap created by a rival of the NPC.",
                    "Plot Hook: The rumors are true and intervention is needed before the eclipse.",
                    "Plot Hook: Anyone asking too many questions about this will be attacked by mercenaries."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];
        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
