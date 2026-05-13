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
                    "Es un secreto a voces que",
                    "Se rumorea por ahí que"
                ],
                subjects: [
                    "{npcName}, el {npcRole}",
                    "el misterioso {npcRole} llamado {npcName}",
                    "nuestro querido {npcRole}, {npcName},",
                    "aquel {npcRole} de nombre {npcName}",
                    "{npcName} (sí, el {npcRole})"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "hizo un pacto con un demonio de encrucijada"
                ],
                locations: [
                    "cerca del viejo bosque de {townName}.",
                    "en los callejones de {townName}.",
                    "a las afueras de {townName}.",
                    "en el cementerio viejo de {townName}.",
                    "justo debajo de las narices del alcalde de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it that",
                    "It's an open secret that",
                    "Word on the street is that"
                ],
                subjects: [
                    "{npcName}, the {npcRole}",
                    "the mysterious {npcRole} named {npcName}",
                    "our beloved {npcRole}, {npcName},",
                    "that {npcRole} named {npcName}",
                    "{npcName} (yes, the {npcRole})"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is a spy",
                    "made a pact with a crossroads demon"
                ],
                locations: [
                    "near the old forest of {townName}.",
                    "in the alleys of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the old graveyard of {townName}.",
                    "right under the mayor of {townName}'s nose."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor in the tavern."
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

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pick(g.intros)} ${pick(g.subjects)} ${pick(g.actions)} ${pick(g.locations)}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pick(g.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
