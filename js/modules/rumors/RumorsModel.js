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
                    "Hay un fuerte rumor circulando en {townName} sobre",
                    "Un mercader forastero llegó a {townName} preguntando por",
                    "Los niños de {townName} murmuran que",
                    "Un mendigo ciego de {townName} jura por los dioses que",
                    "En la última luna llena en {townName}, se supo que",
                    "Las malas lenguas de {townName} aseguran que",
                    "Un guardia de {townName} confesó que",
                    "Se comenta en la taberna de {townName} que",
                    "Nadie confía en él en {townName}, pues cuentan que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "nuestro estimado {npcRole}, {npcName},",
                    "aquel conocido como {npcName} (el {npcRole}),",
                    "{npcName}, el infame {npcRole},",
                    "el misterioso {npcRole} de la ciudad, {npcName},"
                ],
                actions: [
                    "hizo un pacto con un demonio de encrucijada",
                    "está fabricando venenos para un culto secreto",
                    "tiene un hermano gemelo encerrado en su sótano",
                    "fue visto enterrando una extraña reliquia a medianoche",
                    "se transforma en una bestia salvaje al caer la noche",
                    "habla con los muertos en sueños",
                    "es un espía encubierto del reino vecino",
                    "está acumulando una fortuna de origen dudoso",
                    "conoce la ubicación de un tesoro milenario",
                    "es en realidad el líder de una banda de contrabandistas"
                ],
                locations: [
                    "cerca del viejo cementerio.",
                    "en las afueras de {townName}.",
                    "en las profundidades del bosque.",
                    "detrás de la iglesia principal.",
                    "en los callejones oscuros de {townName}.",
                    "justo bajo las narices de las autoridades.",
                    "en las catacumbas olvidadas de {townName}.",
                    "cerca del río que cruza el pueblo.",
                    "en una mansión abandonada.",
                    "lejos de la vista de los curiosos."
                ],
                hooks: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta relacionadas con {npcName}, el {npcRole} en {townName}.",
                    "Gancho de Aventura: {npcName}, el {npcRole}, negará todo rotundamente y se pondrá a la defensiva, pero su diario contiene pistas vitales sobre {townName}.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival de {npcName} (el {npcRole}) para arruinar su reputación en {townName}.",
                    "Gancho de Aventura: Los rumores son ciertos. El {npcRole} {npcName} está bajo los efectos de un encantamiento en {townName} y necesita ser rescatado.",
                    "Gancho de Aventura: {npcName} fue contratado en secreto para investigar la corrupción en {townName}, y su fachada de {npcRole} es una trampa.",
                    "Gancho de Aventura: Los jugadores son atacados por mercenarios en {townName} si preguntan demasiado sobre {npcName}, el {npcRole}.",
                    "Gancho de Aventura: {npcName}, el {npcRole}, suplica ayuda a los jugadores porque está siendo extorsionado por ladrones en {townName}.",
                    "Gancho de Aventura: Un fantasma acecha a {npcName} en {townName}, y solo al resolver un crimen antiguo el {npcRole} tendrá paz.",
                    "Gancho de Aventura: Resulta que {npcName}, el {npcRole} de {townName}, es un dragón de cobre disfrazado buscando entretenimiento.",
                    "Gancho de Aventura: Una extraña plaga en {townName} sigue a los pasos de {npcName}; deben ayudar al {npcRole} a encontrar la cura."
                ]
            },
            en: {
                intros: [
                    "It is said in {townName} that",
                    "There's a strong rumor circulating in {townName} about",
                    "A foreign merchant arrived in {townName} asking for",
                    "The children of {townName} whisper that",
                    "A blind beggar in {townName} swears by the gods that",
                    "On the last full moon in {townName}, it was known that",
                    "Gossip in {townName} has it that",
                    "A guard from {townName} confessed that",
                    "It is discussed in the local tavern of {townName} that",
                    "Nobody in {townName} trusts them, as they say that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "our esteemed {npcRole}, {npcName},",
                    "the one known as {npcName} (the {npcRole}),",
                    "{npcName}, the infamous {npcRole},",
                    "the mysterious {npcRole} of the city, {npcName},"
                ],
                actions: [
                    "made a pact with a crossroad demon",
                    "is crafting poisons for a secret cult",
                    "has a twin brother locked in the basement",
                    "was seen burying a strange relic at midnight",
                    "transforms into a wild beast at nightfall",
                    "speaks to the dead in their dreams",
                    "is an undercover spy from the neighboring kingdom",
                    "is hoarding wealth of dubious origin",
                    "knows the location of a millennia-old treasure",
                    "is actually the leader of a smugglers ring"
                ],
                locations: [
                    "near the old cemetery.",
                    "on the outskirts of {townName}.",
                    "deep within the forest.",
                    "behind the main church.",
                    "in the dark alleys of {townName}.",
                    "right under the nose of the authorities.",
                    "in the forgotten catacombs of {townName}.",
                    "near the river that crosses the town.",
                    "in an abandoned mansion.",
                    "far from the sight of the curious."
                ],
                hooks: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave related to {npcName}, the {npcRole} in {townName}.",
                    "Plot Hook: {npcName}, the {npcRole}, will strongly deny everything and become defensive, but their diary contains vital clues about {townName}.",
                    "Plot Hook: This is just a misunderstanding created by a rival of {npcName} (the {npcRole}) to ruin their reputation in {townName}.",
                    "Plot Hook: The rumors are true. The {npcRole} {npcName} is under an enchantment in {townName} and needs to be rescued.",
                    "Plot Hook: {npcName} was secretly hired to investigate corruption in {townName}, and their {npcRole} facade is a trap.",
                    "Plot Hook: The players are attacked by mercenaries in {townName} if they ask too many questions about {npcName}, the {npcRole}.",
                    "Plot Hook: {npcName}, the {npcRole}, begs the players for help because they are being blackmailed by thieves in {townName}.",
                    "Plot Hook: A ghost haunts {npcName} in {townName}, and only by solving an ancient crime will the {npcRole} find peace.",
                    "Plot Hook: It turns out that {npcName}, the {npcRole} of {townName}, is a copper dragon in disguise looking for entertainment.",
                    "Plot Hook: A strange plague in {townName} follows {npcName}'s footsteps; they must help the {npcRole} find a cure."
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

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
