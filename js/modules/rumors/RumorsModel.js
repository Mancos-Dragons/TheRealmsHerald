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
                    "En la última luna llena, se vio que",
                    "Hay rumores de que",
                    "Nadie confía cuando se trata de que",
                    "Los niños dicen que",
                    "Un guardia asegura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (nuestro querido {npcRole})",
                    "el forastero conocido como {npcName}, el {npcRole},",
                    "la persona llamada {npcName}, que trabaja de {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "está fabricando venenos peligrosos",
                    "hizo un pacto con un demonio de encrucijada",
                    "fue visto bebiendo sangre de un cáliz profano",
                    "puede hacer que cualquiera desaparezca sin dejar rastro"
                ],
                locations: [
                    "cerca del bosque viejo de {townName}.",
                    "en los callejones de {townName}.",
                    "a las afueras de {townName}.",
                    "en el cementerio de {townName}.",
                    "en las sombras de {townName}.",
                    "bajo la taberna principal de {townName}."
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
                    "They say",
                    "Some whisper that",
                    "There were strange noises last night, and they think",
                    "Rumor has it that",
                    "On the last full moon, it was seen that",
                    "There are rumors that",
                    "Nobody trusts it when it comes to the fact that",
                    "The children say that",
                    "A guard swears that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (our beloved {npcRole})",
                    "the outsider known as {npcName}, the {npcRole},",
                    "the person named {npcName}, working as {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is a spy",
                    "is crafting dangerous poisons",
                    "made a pact with a crossroad demon",
                    "was seen drinking blood from a profane chalice",
                    "can make anyone disappear without a trace"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the alleys of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the cemetery of {townName}.",
                    "in the shadows of {townName}.",
                    "under the main tavern of {townName}."
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
        const langGrammar = this.grammar[lang] || this.grammar['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = pickRandom(langGrammar.intros);
        const subject = pickRandom(langGrammar.subjects);
        const action = pickRandom(langGrammar.actions);
        const location = pickRandom(langGrammar.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(langGrammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
