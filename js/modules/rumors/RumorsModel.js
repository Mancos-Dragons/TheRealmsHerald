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
                    "Anoche hubo ruidos y todos creen que",
                    "Dicen las malas lenguas que",
                    "Es un secreto a voces que",
                    "Un mercader forastero jura que",
                    "Nadie confía en él desde que se supo que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "nuestro querido {npcName} (el {npcRole}),",
                    "ese extraño de {npcName}, nuestro {npcRole},",
                    "el infame {npcName}, conocido como el {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está un tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "es en realidad un espía del reino vecino",
                    "desenterró algo maldito",
                    "está fabricando venenos mortales",
                    "hizo un pacto con un demonio",
                    "habla con los árboles y estos le responden",
                    "se desvaneció en las sombras"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "en el viejo cementerio.",
                    "y por eso llegaron mercenarios a {townName}.",
                    "cerca de la encrucijada.",
                    "en el sótano de su casa.",
                    "cuando creía que nadie lo miraba."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta dejadas por {npcName}.",
                    "Gancho de Aventura: {npcName} negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales sobre {townName}.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival de {npcName} para arruinar su reputación como {npcRole}. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. {npcName} está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: {npcName} fue contratado en secreto por el alcalde de {townName} para investigar la corrupción local, y el rumor es una trampa."
                ]
            },
            en: {
                intros: [
                    "They say",
                    "Some whisper that",
                    "There were strange noises last night and everyone thinks",
                    "Rumor has it that",
                    "It's an open secret that",
                    "A foreign merchant swears that",
                    "Nobody trusts them since it became known that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} from {townName},",
                    "our dear {npcName} (the {npcRole}),",
                    "that strange {npcName}, our {npcRole},",
                    "the infamous {npcName}, known as the {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where a lost treasure is",
                    "is summoning forces they don't understand",
                    "is actually a spy from the neighboring kingdom",
                    "dug up something cursed",
                    "is crafting deadly poisons",
                    "made a pact with a demon",
                    "talks to the trees and they talk back",
                    "vanished into the shadows"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "but is too afraid to speak.",
                    "in the old graveyard.",
                    "and that's why mercenaries arrived in {townName}.",
                    "near the crossroads.",
                    "in the basement of their house.",
                    "when they thought nobody was looking."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave left by {npcName}.",
                    "Plot Hook: {npcName} will strongly deny everything and become defensive if pressed, but their diary contains vital clues about {townName}.",
                    "Plot Hook: This is just a misunderstanding created by a rival of {npcName} to ruin their reputation as {npcRole}. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. {npcName} is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: {npcName} was secretly hired by the mayor of {townName} to investigate local corruption, and the rumor is a trap."
                ]
            }
        };
    }

    async generateRumor(townName, npcName, npcRole) {
        const lang = LanguageService.currentLang || 'es';

        const town = townName || this.defaultTown[lang];
        const name = npcName || this.defaultNpcName[lang];
        const role = npcRole || this.defaultNpcRole[lang];

        if (AIService.isConfigured && AIService.isConfigured()) {
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

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let intro = pick(grammar.intros);
        let subject = pick(grammar.subjects);
        let action = pick(grammar.actions);
        let location = pick(grammar.locations);

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = pick(grammar.hooks);
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        // Append variables if they somehow missed replacing
        if (!rumorText.includes(town)) {
            rumorText += lang === 'en' ? ` in ${town}.` : ` en ${town}.`;
        }
        if (!rumorText.includes(name)) {
            rumorText = rumorText.replace(lang === 'en' ? /the /g : /el /g, lang === 'en' ? `the ${name} ` : `el ${name} `); // just a hack to put it in
            if (!rumorText.includes(name)) rumorText = `${name}, ` + rumorText;
        }
        if (!rumorText.includes(role)) {
            if (!rumorText.includes(role)) rumorText = rumorText.replace(name, lang === 'en' ? `${name} the ${role}` : `${name} el ${role}`);
        }

        // Same for hook
        if (!hookText.includes(town)) hookText += lang === 'en' ? ` near ${town}.` : ` cerca de ${town}.`;
        if (!hookText.includes(name)) hookText += lang === 'en' ? ` involving ${name}.` : ` involucrando a ${name}.`;
        if (!hookText.includes(role)) hookText += ` (${role}).`;

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
