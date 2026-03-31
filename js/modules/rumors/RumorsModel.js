import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export const DEFAULTS = {
    town: { es: "Pueblo Viejo", en: "Old Town" },
    npcName: { es: "Desconocido", en: "Unknown" },
    npcRole: { es: "Viajero", en: "Traveler" }
};

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice que", "Algunos murmuran que", "Anoche hubo ruidos y todos piensan que",
                    "Un mercader forastero llegó preguntando si es cierto que",
                    "Dicen las malas lenguas que", "En la taberna se susurra que",
                    "Es un secreto a voces que", "Un guardia juró por su vida que",
                    "Nadie quiere hablar de ello, pero se rumorea que",
                    "Los niños del lugar cantan una rima que asegura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro {npcRole}, {npcName}, de {townName},",
                    "aquel que llaman {npcName}, el {npcRole} de {townName},"
                ],
                actions: [
                    "hizo un pacto oscuro", "fue visto desenterrando algo",
                    "está fabricando venenos", "no es quien dice ser y es un espía",
                    "encontró un artefacto maldito", "robó un tesoro olvidado",
                    "está invocando fuerzas oscuras", "asesinó a alguien a sangre fría",
                    "es en realidad un monstruo disfrazado", "descubrió un mapa del tesoro"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las afueras de {townName}.",
                    "en su sótano secreto.",
                    "en las ruinas antiguas cerca del río.",
                    "durante la última luna llena.",
                    "donde nadie puede verlo.",
                    "en las catacumbas bajo el mercado."
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
                    "They say", "Some whisper that", "There were noises last night and everyone thinks",
                    "A foreign merchant arrived asking if it's true that",
                    "Word around is that", "In the tavern it's whispered that",
                    "It's an open secret that", "A guard swore on his life that",
                    "Nobody wants to talk about it, but it is rumored that",
                    "The local children sing a rhyme claiming that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "our {npcRole}, {npcName}, from {townName},",
                    "the one they call {npcName}, the {npcRole} from {townName},"
                ],
                actions: [
                    "made a dark pact", "was seen digging something up",
                    "is crafting poisons", "is not who they claim to be and is a spy",
                    "found a cursed artifact", "stole a forgotten treasure",
                    "is summoning dark forces", "murdered someone in cold blood",
                    "is actually a monster in disguise", "discovered a treasure map"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old graveyard.",
                    "on the outskirts of {townName}.",
                    "in their secret basement.",
                    "in the ancient ruins near the river.",
                    "during the last full moon.",
                    "where nobody can see them.",
                    "in the catacombs under the market."
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

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const location = grammar.locations[Math.floor(Math.random() * grammar.locations.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
