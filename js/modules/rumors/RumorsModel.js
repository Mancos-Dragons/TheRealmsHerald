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
                    "Un mercader forastero que pasó por {townName} juró que",
                    "Los niños de {townName} cantan sobre cómo",
                    "En la taberna principal de {townName} todos saben que",
                    "Un guardia ebrio en {townName} confesó que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "el infame {npcRole} conocido como {npcName}",
                    "alguien que se hace llamar {npcName} (aparentemente un {npcRole})",
                    "nuestro querido {npcRole}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "está buscando desesperadamente el tesoro perdido",
                    "ha estado invocando fuerzas que no comprende",
                    "en realidad es un espía del reino vecino",
                    "es el heredero perdido de una nobleza caída en desgracia",
                    "hizo un pacto con un demonio de encrucijada"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio durante la última luna llena.",
                    "en las catacumbas bajo la plaza central.",
                    "a las afueras de los muros, donde nadie mira.",
                    "en la habitación más oscura de la posada local.",
                    "en las ruinas del templo olvidado."
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
                    "It is said in {townName} that",
                    "The whisperers of {townName} murmur that",
                    "A foreign merchant passing through {townName} swore that",
                    "The children of {townName} sing about how",
                    "In the main tavern of {townName} everyone knows that",
                    "A drunk guard in {townName} confessed that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "the infamous {npcRole} known as {npcName}",
                    "someone calling themselves {npcName} (apparently a {npcRole})",
                    "our beloved {npcRole}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "is desperately looking for the lost treasure",
                    "has been summoning forces they don't understand",
                    "is actually a spy from the neighboring kingdom",
                    "is the lost heir of a disgraced noble family",
                    "made a pact with a crossroad demon"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old graveyard during the last full moon.",
                    "in the catacombs under the central square.",
                    "just outside the walls, where nobody looks.",
                    "in the darkest room of the local inn.",
                    "in the ruins of the forgotten temple."
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

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pickRandom(grammar.intros)} ${pickRandom(grammar.subjects)} ${pickRandom(grammar.actions)} ${pickRandom(grammar.locations)}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pickRandom(grammar.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
