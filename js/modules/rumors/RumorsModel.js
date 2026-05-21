import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = {
            es: "El Pueblo",
            en: "The Town"
        };
        this.defaultNpcName = {
            es: "El Desconocido",
            en: "The Stranger"
        };
        this.defaultNpcRole = {
            es: "Habitante",
            en: "Villager"
        };

        this.grammar = {
            es: {
                intros: [
                    "Se dice que",
                    "Corre el rumor de que",
                    "Un viajero me contó que",
                    "Escuché en la taberna que",
                    "No deberías repetirlo, pero"
                ],
                subjects: [
                    "{npcName}, el {npcRole} de {townName},",
                    "en secreto, {npcName}, quien trabaja de {npcRole} en {townName},",
                    "la persona conocida como {npcName}, el {npcRole} local de {townName},"
                ],
                actions: [
                    "hizo un pacto con una entidad oscura",
                    "encontró un artefacto antiguo prohibido",
                    "esconde un tesoro inmenso robado al rey",
                    "conoce la entrada secreta a la mazmorra perdida",
                    "asesinó a su predecesor a sangre fría"
                ],
                locations: [
                    "en las afueras de la ciudad.",
                    "bajo el templo abandonado.",
                    "durante la última luna llena.",
                    "en el bosque de los susurros.",
                    "mientras nadie miraba."
                ],
                hooks: [
                    "Gancho de Aventura: Investigar la zona de {townName} donde se vio por última vez a {npcName}, el {npcRole}, revela huellas extrañas.",
                    "Gancho de Aventura: {npcName}, el {npcRole} de {townName}, negará todo, pero su comportamiento nervioso invita a seguirle por la noche.",
                    "Gancho de Aventura: Si los aventureros confrontan a {npcName}, el {npcRole} en {townName}, descubrirán que todo fue una trampa mortal.",
                    "Gancho de Aventura: Un rival ofrece oro por pruebas de este rumor sobre {npcName}, el {npcRole} de {townName}."
                ]
            },
            en: {
                intros: [
                    "It is said that",
                    "Rumor has it that",
                    "A traveler told me that",
                    "I heard in the tavern that",
                    "You shouldn't repeat this, but"
                ],
                subjects: [
                    "{npcName}, the {npcRole} of {townName},",
                    "secretly, {npcName}, who works as the {npcRole} in {townName},",
                    "the person known as {npcName}, the local {npcRole} of {townName},"
                ],
                actions: [
                    "made a pact with a dark entity",
                    "found a forbidden ancient artifact",
                    "hides an immense treasure stolen from the king",
                    "knows the secret entrance to the lost dungeon",
                    "murdered their predecessor in cold blood"
                ],
                locations: [
                    "on the outskirts of the city.",
                    "beneath the abandoned temple.",
                    "during the last full moon.",
                    "in the whispering forest.",
                    "while no one was looking."
                ],
                hooks: [
                    "Plot Hook: Investigating the area of {townName} where {npcName}, the {npcRole}, was last seen reveals strange footprints.",
                    "Plot Hook: {npcName}, the {npcRole} of {townName}, will deny everything, but their nervous behavior invites following them at night.",
                    "Plot Hook: If the adventurers confront {npcName}, the {npcRole} in {townName}, they will discover it was all a deadly trap.",
                    "Plot Hook: A rival offers gold for proof of this rumor about {npcName}, the {npcRole} of {townName}."
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
        const g = this.grammar[lang] || this.grammar['es'];

        const intro = g.intros[Math.floor(Math.random() * g.intros.length)];
        const subject = g.subjects[Math.floor(Math.random() * g.subjects.length)];
        const action = g.actions[Math.floor(Math.random() * g.actions.length)];
        const location = g.locations[Math.floor(Math.random() * g.locations.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        let hookText = g.hooks[Math.floor(Math.random() * g.hooks.length)];
        hookText = hookText.replace(/{townName}/g, town);
        hookText = hookText.replace(/{npcName}/g, name);
        hookText = hookText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
