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
                    "Se dice que ",
                    "Algunos murmuran que ",
                    "Dicen las malas lenguas que ",
                    "Se rumorea que ",
                    "En la taberna se susurra que "
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (el {npcRole} de {townName})",
                    "nuestro {npcRole}, {npcName} de {townName},"
                ],
                actions: [
                    " fue visto haciendo tratos oscuros",
                    " sabe dónde está el tesoro perdido",
                    " está invocando fuerzas que no comprende",
                    " no es quien dice ser y es un espía",
                    " está fabricando venenos"
                ],
                locations: [
                    " cerca del bosque viejo a medianoche.",
                    " en las profundidades del pueblo.",
                    " cerca del cementerio.",
                    " en las sombras del callejón.",
                    " en su sótano cerrado con llave."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman."
                ]
            },
            en: {
                intros: [
                    "They say ",
                    "Some whisper that ",
                    "Word around town is that ",
                    "It is rumored that ",
                    "In the tavern it's whispered that "
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} (the {npcRole} of {townName})",
                    "our {npcRole}, {npcName} from {townName},"
                ],
                actions: [
                    " was seen making dark deals",
                    " knows where the lost treasure is",
                    " is summoning forces they don't understand",
                    " is not who they claim to be and is a spy",
                    " is crafting poisons"
                ],
                locations: [
                    " near the old forest at midnight.",
                    " deep within the town.",
                    " near the old graveyard.",
                    " in the shadows of the alley.",
                    " in their locked basement."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it."
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
        const subjectTemplate = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];
        const hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let subject = subjectTemplate;
        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        const rumorText = intro + subject + action + location;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
