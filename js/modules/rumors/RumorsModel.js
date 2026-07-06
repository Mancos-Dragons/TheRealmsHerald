import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.DEFAULTS = {
            town: { es: "Pueblo Viejo", en: "Old Town" },
            npcName: { es: "Desconocido", en: "Unknown" },
            npcRole: { es: "Viajero", en: "Traveler" }
        };

        this.defaultTown = this.DEFAULTS.town;
        this.defaultNpcName = this.DEFAULTS.npcName;
        this.defaultNpcRole = this.DEFAULTS.npcRole;

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas en {townName} que",
                    "Hay rumores de que",
                    "Se comenta que",
                    "En la taberna de {townName} se susurra que",
                    "No es un secreto que",
                    "La gente de {townName} asegura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName}, nuestro querido {npcRole} de {townName},",
                    "{npcName}, el sospechoso {npcRole} de {townName},",
                    "el forastero conocido como {npcName}, que trabaja como {npcRole} en {townName},",
                    "{npcName}, quien ejerce como {npcRole} en {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros a medianoche.",
                    "sabe dónde está el tesoro perdido, pero tiene miedo de hablar.",
                    "está invocando fuerzas que no comprende.",
                    "está fabricando venenos para un asesino a sueldo.",
                    "hizo un pacto con un demonio de encrucijada.",
                    "es en realidad un espía del reino vecino.",
                    "fue visto desenterrando algo en el cementerio.",
                    "puede hacer que cualquiera desaparezca si se le paga el precio correcto.",
                    "fue visto bebiendo de un cáliz profano."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde, y el rumor es una trampa.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre este rumor en la taberna.",
                    "Gancho de Aventura: El PNJ suplica ayuda a los jugadores porque está siendo extorsionado por un gremio de ladrones."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it in {townName} that",
                    "There are rumors that",
                    "It is commented that",
                    "In the tavern of {townName} it is whispered that",
                    "It's no secret that",
                    "The people of {townName} claim that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName}, our beloved {npcRole} of {townName},",
                    "the suspicious {npcName}, {npcRole} of {townName},",
                    "the outsider known as {npcName}, working as {npcRole} in {townName},",
                    "{npcName}, who serves as {npcRole} in {townName},"
                ],
                actions: [
                    "was seen making dark deals at midnight.",
                    "knows where the lost treasure is, but is afraid to speak.",
                    "is invoking forces they do not understand.",
                    "is brewing poisons for a hired assassin.",
                    "made a pact with a crossroads demon.",
                    "is actually a spy from the neighboring kingdom.",
                    "was seen digging up something in the graveyard.",
                    "can make anyone disappear if paid the right price.",
                    "was seen drinking from a profane chalice."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor, and the rumor is a trap.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about this rumor in the tavern.",
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
        const grammar = this.grammar[lang] || this.grammar['es'];

        const intro = grammar.intros[Math.floor(Math.random() * grammar.intros.length)];
        const subject = grammar.subjects[Math.floor(Math.random() * grammar.subjects.length)];
        const action = grammar.actions[Math.floor(Math.random() * grammar.actions.length)];
        const hookTemplate = grammar.hooks[Math.floor(Math.random() * grammar.hooks.length)];

        let rumorText = `${intro} ${subject} ${action}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hookTemplate;
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
