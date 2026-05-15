import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: 'Pueblo', en: 'Town' };
        this.defaultNpcName = { es: 'Desconocido', en: 'Stranger' };
        this.defaultNpcRole = { es: 'Aldeano', en: 'Villager' };

        this.grammar = {
            es: {
                intros: [
                    "Se rumorea por las calles que",
                    "Un mercader me juró que",
                    "He escuchado en la taberna que",
                    "Los guardias comentaban que",
                    "Dicen las malas lenguas que",
                    "Es un secreto a voces que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, que trabaja como {npcRole} en {townName},"
                ],
                actions: [
                    "tiene un hermano gemelo malvado encerrado",
                    "fue visto hablando con espíritus",
                    "hizo un pacto oscuro a cambio de poder",
                    "esconde un mapa del tesoro robado",
                    "está planeando traicionar al gremio",
                    "fue el único sobreviviente de una emboscada misteriosa"
                ],
                locations: [
                    "en su sótano.",
                    "cerca del cementerio viejo.",
                    "en las ruinas a las afueras de la ciudad.",
                    "debajo del templo.",
                    "en el callejón de las sombras.",
                    "en los bosques prohibidos."
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
                    "It is rumored in the streets that",
                    "A merchant swore to me that",
                    "I heard in the tavern that",
                    "The guards were saying that",
                    "Gossip says that",
                    "It's an open secret that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, who works as a {npcRole} in {townName},"
                ],
                actions: [
                    "has an evil twin brother locked",
                    "was seen speaking with spirits",
                    "made a dark pact in exchange for power",
                    "hides a stolen treasure map",
                    "is planning to betray the guild",
                    "was the sole survivor of a mysterious ambush"
                ],
                locations: [
                    "in their basement.",
                    "near the old graveyard.",
                    "in the ruins outside the city.",
                    "under the temple.",
                    "in the shadow alley.",
                    "in the forbidden woods."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const intro = randomElement(g.intros);
        const subject = randomElement(g.subjects);
        const action = randomElement(g.actions);
        const location = randomElement(g.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = randomElement(g.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}