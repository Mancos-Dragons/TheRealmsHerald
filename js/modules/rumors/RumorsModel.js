import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = {
            es: "Valleoscuro",
            en: "Darkvale"
        };
        this.defaultNpcName = {
            es: "Eldor",
            en: "Eldor"
        };
        this.defaultNpcRole = {
            es: "Mercader",
            en: "Merchant"
        };

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "He escuchado que",
                    "Dicen los rumores que",
                    "Un pajarito me dijo que",
                    "Corre la voz de que",
                    "Es un secreto a voces que"
                ],
                subjects: [
                    "{npcName}, el {npcRole}",
                    "alguien con la misma cara que {npcName}, el {npcRole}",
                    "la sombra de {npcName}, el {npcRole}",
                    "el fantasma de {npcName}, el {npcRole}"
                ],
                actions: [
                    "hizo un pacto oscuro",
                    "esconde un tesoro maldito",
                    "tiene un hermano gemelo malvado",
                    "camina por el techo como una araña",
                    "habla el idioma de los muertos",
                    "puede predecir la muerte"
                ],
                locations: [
                    "en {townName}.",
                    "cerca de {townName}.",
                    "bajo las calles de {townName}.",
                    "en el bosque cercano a {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado por un gremio de ladrones."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "I have heard that",
                    "Rumors say that",
                    "A little bird told me that",
                    "Word on the street is that",
                    "It's an open secret that"
                ],
                subjects: [
                    "{npcName}, the {npcRole}",
                    "someone with the exact same face as {npcName}, the {npcRole}",
                    "the shadow of {npcName}, the {npcRole}",
                    "the ghost of {npcName}, the {npcRole}"
                ],
                actions: [
                    "made a dark pact",
                    "hides a cursed treasure",
                    "has an evil twin brother",
                    "walks on the ceiling like a spider",
                    "speaks the language of the dead",
                    "can predict death"
                ],
                locations: [
                    "in {townName}.",
                    "near {townName}.",
                    "under the streets of {townName}.",
                    "in the forest close to {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC begs the players for help because they are being blackmailed by a thieves guild."
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

        const randomEl = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${randomEl(g.intros)} ${randomEl(g.subjects)} ${randomEl(g.actions)} ${randomEl(g.locations)}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomEl(g.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
