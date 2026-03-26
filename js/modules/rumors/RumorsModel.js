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
                    "Dicen las malas lenguas que",
                    "Nadie confía del todo en que",
                    "Es un secreto a voces que",
                    "Un forastero aseguró que",
                    "Los ancianos del lugar advierten que",
                    "En la taberna no paran de hablar sobre cómo",
                    "Una misteriosa carta afirmaba que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "{npcName} (nuestro {npcRole} en {townName}),",
                    "alguien con la misma apariencia que {npcName}, el {npcRole} de {townName},",
                    "el mismísimo {npcName}, el {npcRole} de {townName},",
                    "la persona que conocemos como {npcName}, el {npcRole} de {townName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es en realidad un espía",
                    "estuvo desenterrando algo extraño",
                    "trajo una reliquia maldita al pueblo",
                    "está fabricando venenos peligrosos",
                    "hizo un pacto con una entidad sobrenatural",
                    "es el heredero perdido de una nobleza caída",
                    "fue descubierto hablando con bestias salvajes",
                    "se desvaneció en las sombras de repente",
                    "puede hacer que cualquiera desaparezca por el precio adecuado",
                    "es el culpable de que las cosechas se hayan echado a perder",
                    "no tiene sombra cuando el sol está en lo más alto",
                    "ha obtenido riquezas repentinas de forma ilícita"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en las afueras del pueblo.",
                    "bajo las ruinas del templo.",
                    "en el cementerio olvidado.",
                    "dentro del pozo seco.",
                    "en la encrucijada del sur.",
                    "en las sombras del callejón trasero.",
                    "en la vieja mansión abandonada.",
                    "cerca de las cuevas de los contrabandistas.",
                    "en el mercado, justo a la vista de todos."
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
                    "They say that",
                    "Some whisper that",
                    "Last night there were rumors that",
                    "Word around is that",
                    "Nobody completely trusts that",
                    "It is an open secret that",
                    "A stranger claimed that",
                    "The local elders warn that",
                    "In the tavern they won't stop talking about how",
                    "A mysterious letter stated that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "{npcName} (our {npcRole} in {townName}),",
                    "someone looking exactly like {npcName}, the {npcRole} of {townName},",
                    "{npcName} themselves, the {npcRole} of {townName},",
                    "the person we know as {npcName}, the {npcRole} from {townName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is actually a spy",
                    "was digging up something strange",
                    "brought a cursed relic to town",
                    "is crafting dangerous poisons",
                    "made a pact with a supernatural entity",
                    "is the lost heir of a fallen nobility",
                    "was discovered talking to wild beasts",
                    "vanished into the shadows suddenly",
                    "can make anyone disappear for the right price",
                    "is to blame for the crops rotting",
                    "casts no shadow when the sun is highest",
                    "has obtained sudden wealth illicitly"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "on the outskirts of town.",
                    "under the temple ruins.",
                    "in the forgotten graveyard.",
                    "inside the dry well.",
                    "at the southern crossroads.",
                    "in the shadows of the back alley.",
                    "in the old abandoned mansion.",
                    "near the smugglers' caves.",
                    "in the market, right in plain sight."
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
        const grammar = this.grammar[lang] || this.grammar['es'];

        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let rumorText = `${pickRandom(grammar.intros)} ${pickRandom(grammar.subjects)} ${pickRandom(grammar.actions)} ${pickRandom(grammar.locations)}`;
        let hookText = pickRandom(grammar.hooks);

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
