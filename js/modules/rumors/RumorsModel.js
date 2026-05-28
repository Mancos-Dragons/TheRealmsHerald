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
                    "Algunos murmuran por {townName} que",
                    "Dicen las malas lenguas de {townName} que",
                    "Hay rumores en {townName} de que",
                    "Un guardia de {townName} asegura que",
                    "Es de conocimiento público en {townName} que",
                    "Los niños de {townName} cantan que",
                    "Un mercader forastero que llegó a {townName} jura que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro querido {npcRole}, {npcName},",
                    "ese extraño {npcRole} llamado {npcName},",
                    "el misterioso {npcRole} {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "es en realidad un espía del reino vecino",
                    "está fabricando venenos mortales",
                    "hizo un pacto con un demonio de encrucijada",
                    "desenterró algo extraño en el viejo cementerio",
                    "habla con los árboles, y que estos le responden"
                ],
                locations: [
                    "cerca del bosque viejo",
                    "en las sombras de los callejones",
                    "a las afueras del pueblo",
                    "en las catacumbas secretas",
                    "en la taberna principal",
                    "justo bajo las narices del alcalde",
                    "durante la última luna llena",
                    "a medianoche, cuando nadie observa"
                ],
                hooks: [
                    "Gancho de Aventura: Los jugadores podrían investigar el lugar mencionado durante la noche para encontrar pistas o rastros.",
                    "Gancho de Aventura: El PNJ intentará reclutar a los jugadores para su causa secreta, revelando que el rumor es solo la mitad de la verdad.",
                    "Gancho de Aventura: Alguien ha puesto un precio por la cabeza del PNJ basándose en estos rumores; los jugadores pueden cobrarlo o ayudarlo a escapar.",
                    "Gancho de Aventura: Un objeto clave para la campaña está relacionado con estas acciones, y el PNJ podría tenerlo en su posesión.",
                    "Gancho de Aventura: Los jugadores son confundidos con aliados del PNJ y son atacados por una facción rival en la ciudad.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva, pero su diario o registros prueban lo contrario.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación; limpiar su nombre podría ser lucrativo.",
                    "Gancho de Aventura: Los rumores son ciertos, pero el PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido pronto."
                ]
            },
            en: {
                intros: [
                    "Word in {townName} is that",
                    "Some whisper in {townName} that",
                    "Rumor in {townName} has it that",
                    "There are tales in {townName} saying",
                    "A guard from {townName} swears that",
                    "It is well known in {townName} that",
                    "The children of {townName} sing that",
                    "A foreign merchant who arrived in {townName} swears that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our dear {npcRole}, {npcName},",
                    "that strange {npcRole} named {npcName},",
                    "the mysterious {npcRole} {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is actually a spy from the neighboring kingdom",
                    "is brewing deadly poisons",
                    "made a pact with a crossroads demon",
                    "dug up something strange in the old cemetery",
                    "speaks to the trees, and that they answer back"
                ],
                locations: [
                    "near the old forest",
                    "in the shadows of the alleys",
                    "on the outskirts of town",
                    "in the secret catacombs",
                    "in the main tavern",
                    "right under the mayor's nose",
                    "during the last full moon",
                    "at midnight, when no one is watching"
                ],
                hooks: [
                    "Adventure Hook: The players could investigate the mentioned place at night to find clues or tracks.",
                    "Adventure Hook: The NPC will try to recruit the players for their secret cause, revealing that the rumor is only half the truth.",
                    "Adventure Hook: Someone has put a bounty on the NPC's head based on these rumors; the players can collect it or help them escape.",
                    "Adventure Hook: A key campaign item is related to these actions, and the NPC might have it in their possession.",
                    "Adventure Hook: The players are mistaken for allies of the NPC and are attacked by a rival faction in the city.",
                    "Adventure Hook: The NPC will strongly deny everything and become defensive, but their diary or records prove otherwise.",
                    "Adventure Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation; clearing their name could be lucrative.",
                    "Adventure Hook: The rumors are true, but the NPC is under an enchantment and needs to be rescued or stopped soon."
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
        const grammarLang = this.grammar[lang] || this.grammar['es'];

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        let introText = pick(grammarLang.intros);
        let subjectText = pick(grammarLang.subjects);
        let actionText = pick(grammarLang.actions);
        let locationText = pick(grammarLang.locations);

        let rumorText = `${introText} ${subjectText} ${actionText} ${locationText}.`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = pick(grammarLang.hooks);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
