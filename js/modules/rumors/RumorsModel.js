import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

const DEFAULTS = {
    town: { es: "Pueblo Viejo", en: "Old Town" },
    npcName: { es: "Desconocido", en: "Unknown" },
    npcRole: { es: "Viajero", en: "Traveler" }
};

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
                    "Anoche hubo ruidos extraños y se cree que",
                    "Un mercader forastero aseguró que",
                    "Dicen las malas lenguas que",
                    "En la taberna se susurra que",
                    "Hay fuertes rumores de que",
                    "Nadie quiere hablar de ello, pero parece que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} ({npcRole}) de {townName}",
                    "el misterioso {npcName} (nuestro {npcRole} en {townName})"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros cerca del bosque viejo a medianoche.",
                    "sabe dónde está el tesoro perdido, pero tiene demasiado miedo para hablar.",
                    "está invocando fuerzas que no comprende.",
                    "no es quien dice ser y en realidad es un espía del reino vecino.",
                    "fue atrapado desenterrando algo en el viejo cementerio.",
                    "está fabricando venenos para un asesino a sueldo.",
                    "hizo un pacto con un demonio de encrucijada.",
                    "es el verdadero heredero perdido de una nobleza caída en desgracia.",
                    "puede hacer que cualquiera desaparezca sin dejar rastro por el precio correcto.",
                    "fue visto bebiendo sangre de un cáliz profano."
                ],
                hooks: [
                    "Los PNJ locales evitan al personaje por miedo. Ofrecen una recompensa si los PJs investigan su casa.",
                    "Un grupo de matones llega al pueblo buscando al PNJ para ajustar cuentas.",
                    "El PNJ pide ayuda a los PJs porque alguien lo está chantajeando con esta información.",
                    "Los PJs encuentran un extraño medallón cerca de donde se vio al PNJ por última vez.",
                    "La guardia local está a punto de arrestar al PNJ; los PJs deben decidir si intervenir.",
                    "Un demonio menor está acechando al PNJ y los PJs se ven envueltos en el fuego cruzado.",
                    "El PNJ ofrece a los PJs una parte del tesoro/secreto si le ayudan a salir del pueblo."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Last night there were strange noises and it is believed that",
                    "A foreign merchant claimed that",
                    "Rumor has it that",
                    "In the tavern it is whispered that",
                    "There are strong rumors that",
                    "Nobody wants to talk about it, but it seems that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "{npcName} ({npcRole}) from {townName}",
                    "the mysterious {npcName} (our {npcRole} in {townName})"
                ],
                actions: [
                    "was seen making dark deals near the old forest at midnight.",
                    "knows where the lost treasure is, but is too afraid to speak.",
                    "is summoning forces they don't understand.",
                    "is not who they claim to be and is actually a spy from the neighboring kingdom.",
                    "was caught digging up something in the old cemetery.",
                    "is brewing poisons for a hired assassin.",
                    "made a pact with a crossroads demon.",
                    "is the true lost heir of a disgraced nobility.",
                    "can make anyone disappear without a trace for the right price.",
                    "was seen drinking blood from a profane chalice."
                ],
                hooks: [
                    "Local NPCs avoid the character out of fear. They offer a reward if the PCs investigate their house.",
                    "A group of thugs arrive in town looking for the NPC to settle a score.",
                    "The NPC asks the PCs for help because someone is blackmailing them with this information.",
                    "The PCs find a strange medallion near where the NPC was last seen.",
                    "The local guard is about to arrest the NPC; the PCs must decide whether to intervene.",
                    "A lesser demon is stalking the NPC and the PCs get caught in the crossfire.",
                    "The NPC offers the PCs a share of the treasure/secret if they help them leave town."
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
        const grammarLang = this.grammar[lang] || this.grammar['es'];

        const intro = grammarLang.intros[Math.floor(Math.random() * grammarLang.intros.length)];
        let subject = grammarLang.subjects[Math.floor(Math.random() * grammarLang.subjects.length)];
        const action = grammarLang.actions[Math.floor(Math.random() * grammarLang.actions.length)];

        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        const rumorText = `${intro} ${subject} ${action}`;
        const hookText = grammarLang.hooks[Math.floor(Math.random() * grammarLang.hooks.length)];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
