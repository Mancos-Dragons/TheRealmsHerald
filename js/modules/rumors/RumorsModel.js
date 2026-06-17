import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.DEFAULTS = {
            town: { es: "Pueblo Viejo", en: "Old Town" },
            npcName: { es: "Desconocido", en: "Unknown" },
            npcRole: { es: "Viajero", en: "Traveler" }
        };

        this.defaultTown = this.DEFAULTS.town;
        this.defaultNpcName = this.DEFAULTS.npcName;
        this.defaultNpcRole = this.DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas que",
                    "Hay rumores de que",
                    "Se rumorea en la taberna que",
                    "Nadie quiere hablar de ello, pero parece que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, quien trabaja como {npcRole} en {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "es en realidad un espía del reino vecino",
                    "fue visto desenterrando algo",
                    "hizo un pacto con un demonio",
                    "está fabricando venenos peligrosos",
                    "es el heredero perdido de una nobleza caída",
                    "habla con los árboles y espíritus"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio.",
                    "en las catacumbas secretas.",
                    "en el callejón detrás de la taberna.",
                    "cerca de la encrucijada.",
                    "en las afueras de la ciudad."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna.",
                    "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado por un gremio de ladrones.",
                    "Gancho de Aventura: Un fantasma acecha a este PNJ, y solo al resolver un crimen antiguo el espíritu descansará."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Word on the street is that",
                    "There are rumors that",
                    "It is rumored in the tavern that",
                    "Nobody wants to talk about it, but it seems that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, who works as the {npcRole} in {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a lost treasure is",
                    "is summoning forces they don't understand",
                    "is actually a spy from the neighboring kingdom",
                    "was seen digging something up",
                    "made a pact with a demon",
                    "is crafting dangerous poisons",
                    "is the lost heir of a fallen nobility",
                    "talks to trees and spirits"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old cemetery.",
                    "in the secret catacombs.",
                    "in the alley behind the tavern.",
                    "near the crossroads.",
                    "on the outskirts of town."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor in the tavern.",
                    "Plot Hook: The NPC begs the players for help because they are being blackmailed by a thieves guild.",
                    "Plot Hook: A ghost haunts this NPC, and only by solving an ancient crime will the spirit rest."
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
        const grammarLang = this.grammar[lang] || this.grammar['es'];

        const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomPick(grammarLang.intros);
        const subject = randomPick(grammarLang.subjects);
        const action = randomPick(grammarLang.actions);
        const location = randomPick(grammarLang.locations);
        const hookText = randomPick(grammarLang.hooks);

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
