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
                    "Anoche hubo ruidos extraños y creen que",
                    "Dicen las malas lenguas que",
                    "Nadie confía en",
                    "Un guardia asegura que vio a",
                    "En la taberna se susurra que",
                    "Hay rumores de que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "fue visto desenterrando algo",
                    "fabricando venenos para un asesino a sueldo",
                    "hizo un pacto con un demonio",
                    "es el heredero perdido de una nobleza caída",
                    "habla con los árboles y estos le responden",
                    "se desvaneció en las sombras durante su ronda",
                    "puede hacer que cualquiera desaparezca"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en los límites de {townName}.",
                    "en el viejo cementerio de {townName}.",
                    "en las calles de {townName}.",
                    "cerca de la encrucijada de {townName}.",
                    "en la taberna de {townName}.",
                    "en las afueras de {townName}."
                ],
                hooks: [
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
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "There were strange noises last night and they think",
                    "Rumor has it that",
                    "Nobody trusts",
                    "A guard swears he saw",
                    "In the tavern it's whispered that",
                    "There are rumors that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is a spy",
                    "was seen digging something up",
                    "is crafting poisons for a hired assassin",
                    "made a pact with a crossroad demon",
                    "is the lost heir of a disgraced noble family",
                    "talks to the trees and the trees talk back",
                    "vanished into the shadows during patrol",
                    "can make anyone disappear without a trace"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the old graveyard of {townName}.",
                    "in the streets of {townName}.",
                    "near the crossroad of {townName}.",
                    "in the tavern of {townName}.",
                    "just outside {townName}."
                ],
                hooks: [
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
        const locationIndex = Math.floor(Math.random() * grammar.locations.length);
        const hookIndex = Math.floor(Math.random() * grammar.hooks.length);

        let rumorText = `${grammar.intros[introIndex]} ${grammar.subjects[subjectIndex]} ${grammar.actions[actionIndex]} ${grammar.locations[locationIndex]}`;

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
