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
                    "Anoche hubo rumores de que",
                    "Un mercader forastero afirma que",
                    "Dicen las malas lenguas en {townName} que",
                    "Hay rumores de que",
                    "Nadie confía en {npcName}, pues se comenta que",
                    "Los cuervos no paran de graznar desde que se supo que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro {npcRole}, {npcName},",
                    "{npcName} (el {npcRole})",
                    "aquel {npcRole} llamado {npcName}"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "está fabricando venenos peligrosos",
                    "hizo un pacto con un demonio de encrucijada",
                    "fue visto desenterrando algo extraño",
                    "tiene un mapa antiguo tatuado en la espalda"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en el viejo cementerio de {townName}.",
                    "a las afueras de {townName}.",
                    "en las sombras de {townName}.",
                    "cerca del río de {townName}.",
                    "en el sótano de la taberna de {townName}."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta, relacionada con {npcName}, el {npcRole} de {townName}.",
                    "Gancho de Aventura: {npcName} (el {npcRole}) negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario en {townName} contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival de {npcName} en {townName} para arruinar la reputación del {npcRole}. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. {npcName}, el {npcRole} de {townName}, está bajo los efectos de un encantamiento y necesita ser rescatado o detenido.",
                    "Gancho de Aventura: {npcName}, el {npcRole}, fue contratado en secreto por el alcalde de {townName} para investigar la corrupción local, y el rumor es una trampa.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios si preguntan demasiado sobre {npcName}, el {npcRole}, en la taberna de {townName}.",
                    "Gancho de Aventura: {npcName}, el {npcRole} de {townName}, suplica ayuda a los jugadores porque está siendo extorsionado por un gremio de ladrones.",
                    "Gancho de Aventura: Un fantasma acecha a este {npcRole}, {npcName}, en {townName}, y solo al resolver un crimen antiguo el espíritu descansará."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "Last night there were rumors that",
                    "A foreign merchant claims that",
                    "Rumor has it in {townName} that",
                    "There are rumors that",
                    "Nobody trusts {npcName}, as it is commented that",
                    "The crows haven't stopped cawing since it became known that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "our {npcRole}, {npcName},",
                    "{npcName} (the {npcRole})",
                    "that {npcRole} named {npcName}"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is a spy",
                    "is crafting dangerous poisons",
                    "made a pact with a crossroad demon",
                    "was seen digging something strange up",
                    "has an ancient map tattooed on their back"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the old graveyard of {townName}.",
                    "on the outskirts of {townName}.",
                    "in the shadows of {townName}.",
                    "near the river of {townName}.",
                    "in the basement of the tavern in {townName}."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave, related to {npcName}, the {npcRole} of {townName}.",
                    "Plot Hook: {npcName} (the {npcRole}) will strongly deny everything and become defensive if pressed, but their diary in {townName} contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of {npcName} in {townName} to ruin the reputation of the {npcRole}. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. {npcName}, the {npcRole} of {townName}, is under an enchantment and needs to be rescued or stopped.",
                    "Plot Hook: {npcName}, the {npcRole}, was secretly hired by the mayor of {townName} to investigate local corruption, and the rumor is a trap.",
                    "Plot Hook: The players are attacked by mercenaries if they ask too many questions about {npcName}, the {npcRole}, in the tavern of {townName}.",
                    "Plot Hook: {npcName}, the {npcRole} of {townName}, begs the players for help because they are being blackmailed by a thieves guild.",
                    "Plot Hook: A ghost haunts this {npcRole}, {npcName}, in {townName}, and only by solving an ancient crime will the spirit rest."
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
        const hookTemplate = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hookTemplate;
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        // fix consecutive spaces, capitalize first letter
        rumorText = rumorText.replace(/\s+/g, ' ').trim();
        rumorText = rumorText.charAt(0).toUpperCase() + rumorText.slice(1);

        hookText = hookText.replace(/\s+/g, ' ').trim();
        hookText = hookText.charAt(0).toUpperCase() + hookText.slice(1);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
