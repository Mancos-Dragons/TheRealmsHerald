import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: "Pueblo Viejo", en: "Old Town" };
        this.defaultNpcName = { es: "Desconocido", en: "Unknown" };
        this.defaultNpcRole = { es: "Viajero", en: "Traveler" };

        this.grammar = {
            intros: {
                es: ["Se dice que", "Algunos murmuran que", "Dicen las malas lenguas que", "Hay rumores de que", "Se comenta que", "Un mendigo jura que", "En la taberna se susurra que", "Nadie lo afirma en voz alta, pero se cree que"],
                en: ["They say", "Some whisper that", "Rumor has it that", "There are rumors that", "Word around is that", "A beggar swears that", "In the tavern it's whispered that", "No one says it aloud, but it's believed that"]
            },
            subjects: {
                es: ["{npcName}, el {npcRole},", "{npcName} (nuestro {npcRole})", "el inconfundible {npcName}, quien trabaja como {npcRole},", "alguien parecido a {npcName}, el {npcRole},", "el misterioso {npcName}, {npcRole} de la zona,"],
                en: ["{npcName}, the {npcRole},", "{npcName} (our {npcRole})", "the unmistakable {npcName}, who works as a {npcRole},", "someone looking like {npcName}, the {npcRole},", "the mysterious {npcName}, local {npcRole},"]
            },
            actions: {
                es: ["fue visto haciendo tratos oscuros", "sabe dónde está un tesoro perdido", "está invocando fuerzas oscuras", "fue confrontado por un mercader", "es en realidad un espía", "fue visto desenterrando algo", "trajo una extraña reliquia", "está fabricando venenos", "hizo un pacto con un demonio", "fue visto caminando por las paredes"],
                en: ["was seen making dark deals", "knows where a lost treasure is", "is summoning dark forces", "was confronted by a merchant", "is actually a spy", "was seen digging something up", "brought back a strange relic", "is crafting poisons", "made a pact with a demon", "was seen walking on walls"]
            },
            locations: {
                es: ["cerca del bosque de {townName}.", "en las afueras de {townName}.", "en el viejo cementerio de {townName}.", "en el mercado principal de {townName}.", "en una cueva cerca de {townName}.", "en la plaza central de {townName}.", "justo fuera de {townName}.", "bajo las calles de {townName}."],
                en: ["near the forest of {townName}.", "on the outskirts of {townName}.", "in the old graveyard of {townName}.", "in the main market of {townName}.", "in a cave near {townName}.", "in the central plaza of {townName}.", "just outside of {townName}.", "beneath the streets of {townName}."]
            },
            hooks: {
                es: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ],
                en: [
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
        const intros = this.grammar.intros[lang] || this.grammar.intros['es'];
        const subjects = this.grammar.subjects[lang] || this.grammar.subjects['es'];
        const actions = this.grammar.actions[lang] || this.grammar.actions['es'];
        const locations = this.grammar.locations[lang] || this.grammar.locations['es'];
        const hooks = this.grammar.hooks[lang] || this.grammar.hooks['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pickRandom(intros)} ${pickRandom(subjects)} ${pickRandom(actions)} ${pickRandom(locations)}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
