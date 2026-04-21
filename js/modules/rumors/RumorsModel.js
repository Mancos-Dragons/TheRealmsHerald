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
                    "Dicen las malas lenguas en {townName} que",
                    "Hay rumores de que",
                    "Nadie confía en él, pero dicen que",
                    "En la taberna se susurra que",
                    "Un guardia asegura que",
                    "Los viajeros que pasan por {townName} afirman que"
                ],
                subjects: [
                    "{npcName}, el {npcRole},",
                    "{npcName} (el {npcRole})",
                    "nuestro {npcRole}, {npcName},",
                    "el {npcRole} de {townName}, {npcName},"
                ],
                actions: [
                    "fue visto haciendo tratos oscuros",
                    "sabe dónde está el tesoro perdido",
                    "está invocando fuerzas que no comprende",
                    "no es quien dice ser y es un espía",
                    "está fabricando venenos",
                    "hizo un pacto con un demonio de encrucijada",
                    "es el heredero perdido de una nobleza caída",
                    "colecciona almas en frascos de cristal"
                ],
                locations: [
                    "cerca del bosque viejo a medianoche.",
                    "pero tiene demasiado miedo para hablar.",
                    "en el viejo cementerio.",
                    "para un asesino a sueldo.",
                    "en las afueras de {townName}.",
                    "en el sótano de la taberna.",
                    "y planea tomar el control pronto."
                ],
                hooks: [
                    "DM Note: El PNJ realmente está involucrado, pero lo están chantajeando.",
                    "Gancho: Los jugadores pueden encontrar un mapa cifrado en la casa del PNJ.",
                    "DM Note: El rumor es falso, creado por un rival comercial del PNJ.",
                    "Gancho: Si los jugadores siguen al PNJ de noche, verán que se reúne con un monstruo amistoso.",
                    "DM Note: El PNJ guarda un artefacto mágico inestable que causa estas anomalías.",
                    "Gancho: El demonio del pacto se acerca a los jugadores para cobrar la deuda del PNJ.",
                    "DM Note: El tesoro es real, pero está protegido por no-muertos.",
                    "Gancho: Alguien ha contratado asesinos para silenciar al PNJ antes de que hable."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Some whisper that",
                    "Rumor has it in {townName} that",
                    "There are rumors that",
                    "No one trusts them, but they say that",
                    "In the tavern they whisper that",
                    "A guard swears that",
                    "Travelers passing through {townName} claim that"
                ],
                subjects: [
                    "{npcName}, the {npcRole},",
                    "{npcName} (the {npcRole})",
                    "our {npcRole}, {npcName},",
                    "the {npcRole} of {townName}, {npcName},"
                ],
                actions: [
                    "was seen making dark deals",
                    "knows where the lost treasure is",
                    "is summoning forces they do not understand",
                    "is not who they claim to be and is a spy",
                    "is brewing poisons",
                    "made a pact with a crossroads demon",
                    "is the lost heir of a fallen nobility",
                    "collects souls in glass jars"
                ],
                locations: [
                    "near the old forest at midnight.",
                    "but is too afraid to speak.",
                    "in the old cemetery.",
                    "for a hired assassin.",
                    "on the outskirts of {townName}.",
                    "in the tavern's basement.",
                    "and plans to take over soon."
                ],
                hooks: [
                    "DM Note: The NPC is actually involved, but is being blackmailed.",
                    "Hook: Players might find an encrypted map in the NPC's house.",
                    "DM Note: The rumor is false, started by a business rival.",
                    "Hook: If players follow the NPC at night, they'll see them meet a friendly monster.",
                    "DM Note: The NPC holds an unstable magical artifact causing these anomalies.",
                    "Hook: The pact demon approaches the players to collect the NPC's debt.",
                    "DM Note: The treasure is real, but protected by undead.",
                    "Hook: Someone hired assassins to silence the NPC before they talk."
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
        const hookTextRaw = g.hooks[Math.floor(Math.random() * g.hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = hookTextRaw.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
