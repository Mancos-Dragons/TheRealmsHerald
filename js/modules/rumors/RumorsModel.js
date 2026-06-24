import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: "Pueblo Viejo", en: "Old Town" };
        this.defaultNpcName = { es: "Desconocido", en: "Unknown" };
        this.defaultNpcRole = { es: "Viajero", en: "Traveler" };

        this.grammar = {
            intros: {
                es: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas en la taberna que",
                    "Hay rumores de que",
                    "Nadie confía en él, se comenta que",
                    "Se rumorea por el pueblo que"
                ],
                en: [
                    "It is said that",
                    "Some whisper that",
                    "Tavern gossips claim that",
                    "There are rumors that",
                    "No one trusts them, it is commented that",
                    "It's rumored around town that"
                ]
            },
            subjects: {
                es: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, quien trabaja como {npcRole} en {townName},"
                ],
                en: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, who works as a {npcRole} in {townName},"
                ]
            },
            actions: {
                es: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y en realidad es un espía",
                    "fue visto desenterrando algo misterioso",
                    "está fabricando venenos prohibidos",
                    "hizo un pacto con un demonio de encrucijada"
                ],
                en: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is actually a spy",
                    "was seen digging up something mysterious",
                    "is brewing forbidden poisons",
                    "made a pact with a crossroads demon"
                ]
            },
            locations: {
                es: [
                    "cerca del bosque viejo a medianoche.",
                    "en las afueras de la región.",
                    "en el viejo cementerio.",
                    "oculto en las sombras.",
                    "donde nadie puede verlo.",
                    "en las ruinas abandonadas."
                ],
                en: [
                    "near the old forest at midnight.",
                    "on the outskirts of the region.",
                    "in the old cemetery.",
                    "hidden in the shadows.",
                    "where no one can see them.",
                    "in the abandoned ruins."
                ]
            },
            hooks: {
                es: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ],
                en: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped.",
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
        const grammar = this.grammar;
        const intros = grammar.intros[lang] || grammar.intros['es'];
        const subjects = grammar.subjects[lang] || grammar.subjects['es'];
        const actions = grammar.actions[lang] || grammar.actions['es'];
        const locations = grammar.locations[lang] || grammar.locations['es'];
        const hooks = grammar.hooks[lang] || grammar.hooks['es'];

        const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomElement(intros)} ${randomElement(subjects)} ${randomElement(actions)} ${randomElement(locations)}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomElement(hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
