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
                    "Dicen las malas lenguas en {townName} que",
                    "Hay rumores de que",
                    "La gente comenta que",
                    "Un guardia en {townName} asegura que",
                    "Es un secreto a voces que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (el {npcRole})",
                    "nuestro {npcRole}, {npcName},",
                    "el infame {npcRole} conocido como {npcName}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "estaba desenterrando algo extraño",
                    "fue sorprendido fabricando venenos",
                    "está invocando fuerzas que no comprende",
                    "habla en secreto con los árboles",
                    "se desvanece misteriosamente en las sombras",
                    "estuvo fabricando amuletos extraños",
                    "escondió un cofre con un tesoro"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en el viejo cementerio de {townName}.",
                    "en los oscuros callejones de {townName}.",
                    "cerca de la encrucijada a las afueras de {townName}.",
                    "en los límites de {townName}.",
                    "en el sótano del ayuntamiento de {townName}.",
                    "a las orillas del río de {townName}.",
                    "entre las ruinas cercanas a {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse."
                ]
            },
            en: {
                intros: [
                    "They say that",
                    "Some whisper that",
                    "Rumor has it in {townName} that",
                    "There are rumors that",
                    "The word around {townName} is that",
                    "A guard in {townName} swears that",
                    "It is a well-known secret that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (the {npcRole})",
                    "our {npcRole}, {npcName},",
                    "the infamous {npcRole} known as {npcName}"
                ],
                actions: [
                    "was seen making dark deals",
                    "was digging something strange up",
                    "was caught crafting poisons",
                    "is summoning forces they don't understand",
                    "speaks in secret to the trees",
                    "mysteriously vanishes into the shadows",
                    "was crafting strange amulets",
                    "hid a treasure chest"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the old graveyard of {townName}.",
                    "in the dark alleys of {townName}.",
                    "near the crossroad outside of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the town hall basement of {townName}.",
                    "along the river banks of {townName}.",
                    "among the ruins near {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse."
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

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        // Ensure all placeholders are replaced globally in case they appear multiple times
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        // Remove double spaces if intros/locations were empty or stitched weirdly
        rumorText = rumorText.replace(/\s+/g, ' ').trim();

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
