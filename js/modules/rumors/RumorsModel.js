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
                    "Dicen las malas lenguas que",
                    "Hay rumores de que",
                    "Nadie confía en que",
                    "Se rumorea en {townName} que",
                    "Los niños de {townName} dicen que",
                    "Un guardia en {townName} asegura que",
                    "En la taberna de {townName} se susurra que",
                    "Se comenta en el mercado de {townName} que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (el {npcRole})",
                    "{npcName}, nuestro {npcRole},",
                    "{npcName}, el {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y en realidad es un espía",
                    "fue visto desenterrando algo",
                    "trajo una extraña reliquia",
                    "está fabricando venenos",
                    "hizo un pacto con un demonio",
                    "es el heredero perdido de una nobleza",
                    "habla con los árboles y estos le responden",
                    "puede hacer que cualquiera desaparezca sin dejar rastro",
                    "colecciona almas en frascos de cristal",
                    "tiene un hermano gemelo malvado encerrado en su sótano",
                    "habla fluidamente el idioma de los muertos",
                    "encontró la entrada a la Ciudad Subterránea"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "en el viejo cementerio.",
                    "a su casa.",
                    "para un asesino a sueldo.",
                    "en una encrucijada cercana.",
                    "durante su ronda.",
                    "sin dejar rastro.",
                    "en el sótano.",
                    "en las montañas."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "Word around {townName} is that",
                    "There are rumors that",
                    "Nobody trusts that",
                    "Rumor has it in {townName} that",
                    "The children of {townName} say that",
                    "A guard in {townName} swears that",
                    "In the tavern of {townName} it's whispered that",
                    "It's discussed in the market of {townName} that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "{npcName} (the {npcRole})",
                    "{npcName}, our {npcRole},",
                    "{npcName}, the {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is actually a spy",
                    "was seen digging something up",
                    "brought a strange relic",
                    "is crafting poisons",
                    "made a pact with a crossroad demon",
                    "is the lost heir of a disgraced noble family",
                    "talks to the trees and the trees talk back",
                    "can make anyone disappear without a trace",
                    "collects souls in glass jars",
                    "has an evil twin brother locked in their basement",
                    "speaks the language of the dead fluently",
                    "found the entrance to the Underground City"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "but is too afraid to speak.",
                    "in the old graveyard.",
                    "to their house.",
                    "for a hired assassin.",
                    "near a crossroad.",
                    "during their patrol.",
                    "without a trace.",
                    "in the basement.",
                    "in the mountains."
                ]
            }
        };

        this.plotHooks = {
            es: [
                "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa.",
                "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna.",
                "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado por un gremio de ladrones.",
                "Gancho de Aventura: Un fantasma acecha a este PNJ, y solo al resolver un crimen antiguo el espíritu descansará.",
                "Gancho de Aventura: El PNJ resulta ser un dragón de cobre disfrazado que solo busca entretenerse con mortales.",
                "Gancho de Aventura: Una extraña plaga sigue a los pasos del PNJ; los aventureros deben encontrar una cura mítica."
            ],
            en: [
                "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap.",
                "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor in the tavern.",
                "Plot Hook: The NPC begs the players for help because they are being blackmailed by a thieves guild.",
                "Plot Hook: A ghost haunts this NPC, and only by solving an ancient crime will the spirit rest.",
                "Plot Hook: The NPC turns out to be a copper dragon in disguise who is just looking to be entertained by mortals.",
                "Plot Hook: A strange plague follows in the NPC's footsteps; the adventurers must find a mythical cure."
            ]
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
        const hooks = this.plotHooks[lang] || this.plotHooks['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pickRandom(grammar.intros);
        const subject = pickRandom(grammar.subjects);
        const action = pickRandom(grammar.actions);
        const location = pickRandom(grammar.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = hooks[Math.floor(Math.random() * hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
