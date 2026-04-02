import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { DEFAULTS } from './RumorsData.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = DEFAULTS.town;
        this.defaultNpcName = DEFAULTS.npcName;
        this.defaultNpcRole = DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Se rumorea en la taberna que",
                    "Dicen las malas lenguas que",
                    "Un mercader forastero aseguró que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "el {npcRole} de {townName}, {npcName},",
                    "nadie menos que {npcName} ({npcRole} de {townName}),"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está escondiendo un gran secreto",
                    "sabe dónde está el tesoro perdido de {townName}",
                    "ha estado actuando de manera muy extraña",
                    "hizo un pacto con un demonio"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en las afueras de {townName}.",
                    "en los túneles subterráneos.",
                    "cuando nadie más estaba mirando.",
                    "antes de desaparecer sin dejar rastro."
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
                    "Rumor in the tavern is that",
                    "Word on the street is that",
                    "A foreign merchant swore that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "the {npcRole} of {townName}, {npcName},",
                    "none other than {npcName} (the {npcRole} of {townName}),"
                ],
                actions: [
                    "was seen making dark deals",
                    "is hiding a great secret",
                    "knows where the lost treasure of {townName} is",
                    "has been acting very strangely",
                    "made a pact with a demon"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "on the outskirts of {townName}.",
                    "in the underground tunnels.",
                    "when nobody else was looking.",
                    "before disappearing without a trace."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];
        const hook = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hook
        };
    }
}
