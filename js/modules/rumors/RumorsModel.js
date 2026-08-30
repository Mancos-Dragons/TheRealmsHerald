import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

const DEFAULTS = {
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
                    "Se dice que ",
                    "Algunos murmuran que ",
                    "Cuentan por ahí que ",
                    "Se rumorea en la taberna que ",
                    "Es un secreto a voces que "
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro querido {npcRole} de {townName}, {npcName},",
                    "{npcName} (el misterioso {npcRole} de {townName})",
                    "el infame {npcRole} de {townName}, {npcName},"
                ],
                actions: [
                    " fue visto haciendo tratos oscuros cerca del bosque viejo a medianoche.",
                    " sabe dónde está el tesoro perdido, pero tiene demasiado miedo para hablar.",
                    " está invocando fuerzas que no comprende.",
                    " no es quien dice ser y en realidad es un espía del reino vecino.",
                    " hizo un pacto con un demonio de encrucijada.",
                    " está fabricando venenos para un asesino a sueldo.",
                    " fue visto bebiendo sangre de un cáliz profano.",
                    " tiene un hermano gemelo malvado encerrado en su sótano."
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
                    "They say ",
                    "Some whisper that ",
                    "Rumor has it that ",
                    "It's rumored in the tavern that ",
                    "It's an open secret that "
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "our beloved {npcRole} of {townName}, {npcName},",
                    "{npcName} (the mysterious {npcRole} of {townName})",
                    "the infamous local {npcRole} of {townName}, {npcName},"
                ],
                actions: [
                    " was seen making dark deals near the old forest at midnight.",
                    " knows where the lost treasure is, but is too afraid to speak.",
                    " is summoning forces they don't understand.",
                    " is not who they claim to be and is actually a spy from the neighboring kingdom.",
                    " made a pact with a crossroad demon.",
                    " is crafting poisons for a hired assassin.",
                    " was seen drinking blood from a profane chalice.",
                    " has an evil twin brother locked in their basement."
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

        const introIndex = Math.floor(Math.random() * grammar.intros.length);
        const subjectIndex = Math.floor(Math.random() * grammar.subjects.length);
        const actionIndex = Math.floor(Math.random() * grammar.actions.length);
        const hookIndex = Math.floor(Math.random() * grammar.hooks.length);

        let rumorText = grammar.intros[introIndex] + grammar.subjects[subjectIndex] + grammar.actions[actionIndex];
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = grammar.hooks[hookIndex];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
