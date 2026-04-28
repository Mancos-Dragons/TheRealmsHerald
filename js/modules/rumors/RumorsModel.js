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
                    "Se dice que", "Algunos murmuran que", "Un mercader forastero jura que",
                    "Dicen las malas lenguas que", "Hay rumores oscuros de que", "Un guardia aseguró que",
                    "Es un secreto a voces que", "En la última luna llena, se vio que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},", "{npcName} ({el_la} {npcRole})",
                    "nuestro estimado {npcRole}, {npcName},", "aquel {npcRole} llamado {npcName}"
                ],
                actions: [
                    "hizo un pacto con un demonio", "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido", "está invocando fuerzas que no comprende",
                    "no es quien dice ser", "está fabricando venenos para un asesino",
                    "habla con los muertos", "desenterró algo maldito"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.", "en las alcantarillas de {townName}.",
                    "en el viejo cementerio de {townName}.", "en las sombras de {townName}.",
                    "afuera de {townName}.", "justo debajo de las calles de {townName}.",
                    "en la plaza central de {townName}.", "cerca de la taberna de {townName}."
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
                    "It is said that", "Some whisper that", "A foreign merchant swears that",
                    "Rumor has it that", "There are dark rumors that", "A guard claimed that",
                    "It is an open secret that", "On the last full moon, it was seen that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},", "{npcName} (the {npcRole})",
                    "our esteemed {npcRole}, {npcName},", "that {npcRole} named {npcName}"
                ],
                actions: [
                    "made a pact with a demon", "was seen making shady deals",
                    "knows where the lost treasure is", "is summoning forces they don't understand",
                    "is not who they claim to be", "is crafting poisons for an assassin",
                    "speaks with the dead", "unearthed something cursed"
                ],
                locations: [
                    "near the old forest of {townName}.", "in the sewers of {townName}.",
                    "in the old cemetery of {townName}.", "in the shadows of {townName}.",
                    "outside {townName}.", "just beneath the streets of {townName}.",
                    "in the central plaza of {townName}.", "near the tavern of {townName}."
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

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = pick(grammar.intros);
        let subject = pick(grammar.subjects);
        let action = pick(grammar.actions);
        let location = pick(grammar.locations);
        let hookText = pick(grammar.hooks);

        // Basic helper for gender if needed, could be expanded. Defaults to "el"
        let el_la = "el";

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);
        rumorText = rumorText.replace(/{el_la}/g, el_la);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
