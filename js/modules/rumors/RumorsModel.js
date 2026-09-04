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
                    "Hay rumores de que",
                    "Nadie confía en que",
                    "Dicen las malas lenguas que",
                    "Un mercader forastero jura que",
                    "En la taberna se susurra que",
                    "Un guardia asegura que",
                    "Se comenta en el mercado que",
                    "Los viajeros afirman que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro {npcRole}, {npcName}, (de {townName})",
                    "el misterioso {npcRole} conocido como {npcName} de {townName},",
                    "ese {npcRole}, {npcName}, en las afueras de {townName},",
                    "el infame {npcRole}, {npcName} (residente de {townName}),"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser",
                    "fue visto desenterrando algo",
                    "está fabricando venenos para un asesino a sueldo",
                    "hizo un pacto con un demonio de encrucijada",
                    "es el heredero perdido de una nobleza caída en desgracia",
                    "se desvaneció en las sombras durante su ronda",
                    "puede hacer que cualquiera desaparezca sin dejar rastro",
                    "bebió sangre de un cáliz profano",
                    "tiene un mapa antiguo tatuado en la espalda",
                    "es en realidad una abominación encubierta"
                ],
                complications: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "y los cuervos no paran de graznar desde entonces.",
                    "y en realidad es un espía del reino vecino.",
                    "en el viejo cementerio.",
                    "y las luces de su casa parpadean con un color morado antinatural.",
                    "y las herramientas en su taller se mueven solas.",
                    "y colecciona almas en frascos de cristal."
                ],
                hooks: [
                    "Los jugadores podrían investigar el bosque viejo a medianoche para confirmar.",
                    "El PNJ tiene un mapa o un objeto clave oculto. Hay que ganar su confianza o intimidarlo.",
                    "Hay que investigar su casa, tal vez haya un diario o pistas de su verdadera identidad.",
                    "Si lo siguen discretamente, los jugadores podrían descubrir la reunión de un culto.",
                    "Las autoridades locales ofrecen una recompensa por pruebas tangibles de esto.",
                    "Alguien más está investigando esto y necesita guardaespaldas.",
                    "El PNJ se acercará a los jugadores pidiendo ayuda porque 'sabe demasiado' y está en peligro.",
                    "Si excavan en el cementerio, encontrarán algo terrible que despertará."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "There are rumors that",
                    "Nobody trusts that",
                    "Gossip says that",
                    "A foreign merchant swears that",
                    "In the tavern they whisper that",
                    "A guard assures that",
                    "It's commented in the market that",
                    "Travelers claim that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "our {npcRole}, {npcName}, (from {townName})",
                    "the mysterious {npcRole} known as {npcName} from {townName},",
                    "that {npcRole}, {npcName}, on the outskirts of {townName},",
                    "the infamous {npcRole}, {npcName} (resident of {townName}),"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be",
                    "was seen digging something up",
                    "is brewing poisons for a hired assassin",
                    "made a pact with a crossroads demon",
                    "is the lost heir of a disgraced nobility",
                    "vanished into the shadows during their patrol",
                    "can make anyone disappear without a trace",
                    "drank blood from an unholy chalice",
                    "has an ancient map tattooed on their back",
                    "is actually a covert abomination"
                ],
                complications: [
                    "near the old forest at midnight.",
                    "but is too scared to speak.",
                    "and the crows won't stop cawing since.",
                    "and is actually a spy from the neighboring kingdom.",
                    "in the old cemetery.",
                    "and the lights in their house flicker with an unnatural purple color.",
                    "and the tools in their workshop move by themselves.",
                    "and collects souls in glass jars."
                ],
                hooks: [
                    "The players could investigate the old forest at midnight to confirm.",
                    "The NPC has a map or hidden key item. The players must gain their trust or intimidate them.",
                    "They should investigate their house, maybe there's a diary or clues to their true identity.",
                    "If followed discreetly, the players might discover a cult gathering.",
                    "Local authorities offer a reward for tangible proof of this.",
                    "Someone else is investigating this and needs bodyguards.",
                    "The NPC will approach the players asking for help because they 'know too much' and are in danger.",
                    "If they dig in the cemetery, they will find something terrible that will awaken."
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

        const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = getRandom(grammar.intros);
        let subject = getRandom(grammar.subjects);
        let action = getRandom(grammar.actions);
        let complication = getRandom(grammar.complications);
        let hookText = getRandom(grammar.hooks);

        subject = subject.replace(/{townName}/g, town);
        subject = subject.replace(/{npcName}/g, name);
        subject = subject.replace(/{npcRole}/g, role);

        let rumorText = `${intro} ${subject} ${action} ${complication}`;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
