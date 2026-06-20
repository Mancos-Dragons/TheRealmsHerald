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
                    "Anoche hubo ruidos extraños y creen que",
                    "Dicen las malas lenguas que",
                    "Nadie confía en que",
                    "Hay fuertes rumores de que"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "aquel llamado {npcName}, nuestro {npcRole} local en {townName},",
                    "el misterioso {npcName}, que trabaja como {npcRole} en {townName},",
                    "{npcName}, conocido en {townName} por ser {npcRole},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "fue visto desenterrando algo",
                    "está fabricando venenos prohibidos",
                    "hizo un pacto con un demonio",
                    "es el heredero perdido de una nobleza caída",
                    "habla con los árboles oscuros"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "en las catacumbas olvidadas.",
                    "en el viejo cementerio.",
                    "cerca de la encrucijada.",
                    "en las sombras del callejón.",
                    "bajo las ruinas de la antigua torre."
                ],
                hooks: [
                    "DM Note: Los jugadores pueden encontrar a {npcName} en {townName} y buscar pruebas de sus crímenes en su lugar de trabajo.",
                    "DM Note: {npcName} de {townName} pedirá ayuda a los jugadores para limpiar su nombre, o podría emboscarlos si descubren la verdad.",
                    "DM Note: Un rival de {npcName} en {townName} contrató a alguien para difundir este rumor y arruinar la reputación del {npcRole}.",
                    "DM Note: Si los jugadores investigan a {npcName} en {townName}, descubrirán un mapa escondido entre sus pertenencias.",
                    "DM Note: La guardia de {townName} ya está buscando a {npcName}. Los jugadores pueden entregarlo por una recompensa o ayudarlo a huir."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Last night there were strange noises and people believe that",
                    "Rumor has it that",
                    "No one trusts that",
                    "There are strong rumors that"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "the one called {npcName}, our local {npcRole} in {townName},",
                    "the mysterious {npcName}, who works as a {npcRole} in {townName},",
                    "{npcName}, known in {townName} as a {npcRole},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they don't understand",
                    "is not who they claim to be and is a spy",
                    "was seen digging something up",
                    "is brewing forbidden poisons",
                    "made a pact with a demon",
                    "is the lost heir of a fallen nobility",
                    "speaks to the dark trees"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "in the forgotten catacombs.",
                    "in the old graveyard.",
                    "near the crossroads.",
                    "in the shadows of the alley.",
                    "under the ruins of the ancient tower."
                ],
                hooks: [
                    "DM Note: The players can find {npcName} in {townName} and search for proof of their crimes at their workplace.",
                    "DM Note: {npcName} from {townName} will ask the players for help to clear their name, or might ambush them if they learn the truth.",
                    "DM Note: A rival of {npcName} in {townName} hired someone to spread this rumor to ruin the {npcRole}'s reputation.",
                    "DM Note: If the players investigate {npcName} in {townName}, they will find a hidden map among their belongings.",
                    "DM Note: The guard in {townName} is already looking for {npcName}. Players can turn them in for a bounty or help them flee."
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
        const subject = grammarLang.subjects[Math.floor(Math.random() * grammarLang.subjects.length)];
        const action = grammarLang.actions[Math.floor(Math.random() * grammarLang.actions.length)];
        const location = grammarLang.locations[Math.floor(Math.random() * grammarLang.locations.length)];
        const hook = grammarLang.hooks[Math.floor(Math.random() * grammarLang.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hook;
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText.trim(),
            hook: hookText.trim()
        };
    }
}
