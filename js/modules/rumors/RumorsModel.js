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
                    "Anoche se comentó que",
                    "Dicen las malas lenguas que",
                    "Hay rumores de que",
                    "Nadie quiere hablar de ello, pero se cuenta que",
                    "Un forastero aseguró que",
                    "En la taberna se susurra que",
                    "Es un secreto a voces que",
                    "Los más viejos del lugar juran que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, quien ejerce de {npcRole} en {townName},",
                    "aquel {npcRole} llamado {npcName} que ronda por {townName}",
                    "ese extraño {npcRole} conocido como {npcName} en {townName}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser",
                    "fue visto desenterrando algo inquietante",
                    "está fabricando venenos mortales",
                    "hizo un pacto con un demonio",
                    "es en realidad el heredero de una nobleza caída",
                    "desapareció en las sombras sin dejar rastro",
                    "puede hacer que cualquiera desaparezca"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "bajo la luz de la última luna llena.",
                    "mientras todos dormían.",
                    "en los callejones más oscuros.",
                    "en las ruinas a las afueras de la ciudad.",
                    "en el cementerio olvidado.",
                    "donde la luz no llega.",
                    "cuando la niebla es más espesa.",
                    "en los pasillos ocultos bajo tierra.",
                    "cerca del altar profanado."
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
                    "They say that",
                    "Some whisper that",
                    "Last night it was mentioned that",
                    "Rumor has it that",
                    "There are rumors that",
                    "Nobody wants to talk about it, but it is told that",
                    "A stranger claimed that",
                    "In the tavern it's whispered that",
                    "It's an open secret that",
                    "The elders of the place swear that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, who works as a {npcRole} in {townName},",
                    "that {npcRole} named {npcName} hanging around {townName}",
                    "that strange {npcRole} known as {npcName} in {townName}"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be",
                    "was seen digging up something disturbing",
                    "is crafting deadly poisons",
                    "made a pact with a demon",
                    "is actually the heir of a fallen nobility",
                    "vanished into the shadows without a trace",
                    "can make anyone disappear"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "under the light of the last full moon.",
                    "while everyone was sleeping.",
                    "in the darkest alleys.",
                    "in the ruins just outside the city.",
                    "in the forgotten graveyard.",
                    "where the light does not reach.",
                    "when the fog is thickest.",
                    "in the hidden passages underground.",
                    "near the desecrated altar."
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

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomEl(grammar.intros);
        const subject = randomEl(grammar.subjects);
        const action = randomEl(grammar.actions);
        const location = randomEl(grammar.locations);
        const hookText = randomEl(grammar.hooks);

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
