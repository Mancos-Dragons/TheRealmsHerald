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
                    "Se dice en {townName} que",
                    "Las malas lenguas de {townName} murmuran que",
                    "Un mercader que llegó a {townName} asegura que",
                    "En la taberna de {townName} se comenta que",
                    "Los guardias de {townName} sospechan que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} ({npcRole}),",
                    "nuestro querido {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "esconde un oscuro secreto",
                    "está invocando fuerzas que no comprende",
                    "encontró un mapa del tesoro antiguo",
                    "perdió algo muy valioso y peligroso"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el cementerio de la colina.",
                    "bajo las ruinas del castillo.",
                    "en los callejones más oscuros.",
                    "en las catacumbas olvidadas."
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
                    "They say in {townName} that",
                    "The gossips of {townName} whisper that",
                    "A merchant who arrived in {townName} swears that",
                    "In the tavern of {townName} it is commented that",
                    "The guards of {townName} suspect that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (the {npcRole}),",
                    "our dear {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "hides a dark secret",
                    "is summoning forces they don't understand",
                    "found an ancient treasure map",
                    "lost something very valuable and dangerous"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the graveyard on the hill.",
                    "under the castle ruins.",
                    "in the darkest alleys.",
                    "in the forgotten catacombs."
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

        const g = this.grammar[lang] || this.grammar['es'];

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = randomEl(g.intros);
        let subject = randomEl(g.subjects);
        let action = randomEl(g.actions);
        let location = randomEl(g.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = randomEl(g.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
