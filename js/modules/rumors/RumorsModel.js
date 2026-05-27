import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsModel {
    constructor() {
        this.defaultTown = { es: "Pueblo Viejo", en: "Old Town" };
        this.defaultNpcName = { es: "Desconocido", en: "Unknown" };
        this.defaultNpcRole = { es: "Viajero", en: "Traveler" };

        this.grammar = {
            intros: {
                es: [
                    "Se dice que",
                    "Algunos murmuran que",
                    "Dicen las malas lenguas que",
                    "Un mercader forastero jura que",
                    "Los niños del pueblo dicen que",
                    "Se rumorea en la taberna que",
                    "Nadie lo confirma, pero dicen que",
                    "Un mendigo ciego asegura que"
                ],
                en: [
                    "They say",
                    "Some whisper that",
                    "Word around town is that",
                    "A foreign merchant swears that",
                    "The local children say that",
                    "It's rumored in the tavern that",
                    "Nobody confirms it, but they say",
                    "A blind beggar swears that"
                ]
            },
            subjects: {
                es: [
                    "{npcName}, nuestro respetable {npcRole},",
                    "el misterioso {npcRole} conocido como {npcName},",
                    "ese extraño {npcRole}, {npcName},",
                    "{npcName} (el {npcRole} local)",
                    "el {npcRole} llamado {npcName}"
                ],
                en: [
                    "{npcName}, our respectable {npcRole},",
                    "the mysterious {npcRole} known as {npcName},",
                    "that strange {npcRole}, {npcName},",
                    "{npcName} (the local {npcRole})",
                    "the {npcRole} named {npcName}"
                ]
            },
            actions: {
                es: [
                    "hizo un pacto con un demonio",
                    "desenterró una reliquia maldita",
                    "fue visto haciendo tratos oscuros",
                    "es en realidad un espía disfrazado",
                    "colecciona almas en frascos de cristal",
                    "habla con los muertos en las noches de luna llena",
                    "encontró el mapa hacia un tesoro perdido",
                    "tiene un gemelo malvado encerrado en el sótano"
                ],
                en: [
                    "made a pact with a demon",
                    "dug up a cursed relic",
                    "was seen making dark deals",
                    "is actually a spy in disguise",
                    "collects souls in glass jars",
                    "speaks to the dead on full moon nights",
                    "found the map to a lost treasure",
                    "has an evil twin locked in the basement"
                ]
            },
            locations: {
                es: [
                    "cerca de {townName}.",
                    "en las afueras de {townName}.",
                    "justo bajo las narices de todo {townName}.",
                    "en los callejones de {townName}.",
                    "a unas leguas de {townName}.",
                    "en el viejo cementerio de {townName}.",
                    "en los túneles secretos bajo {townName}.",
                    "cerca del pozo principal de {townName}."
                ],
                en: [
                    "near {townName}.",
                    "on the outskirts of {townName}.",
                    "right under the nose of all {townName}.",
                    "in the alleys of {townName}.",
                    "a few leagues from {townName}.",
                    "in the old graveyard of {townName}.",
                    "in the secret tunnels under {townName}.",
                    "near the main well of {townName}."
                ]
            },
            hooks: {
                es: [
                    "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
                    "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
                    "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
                    "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse.",
                    "Gancho de Aventura: El PNJ fue contratado en secreto por el alcalde para investigar la corrupción local, y el rumor es una trampa."
                ],
                en: [
                    "Plot Hook: If the players investigate the area, they will find mysterious footprints leading to a hidden cave.",
                    "Plot Hook: The NPC will strongly deny everything and become defensive if pressed, but their diary contains vital clues.",
                    "Plot Hook: This is just a misunderstanding created by a rival of the NPC to ruin their reputation. The rival will offer gold if the adventurers confirm it.",
                    "Plot Hook: The rumors are true. The NPC is under an enchantment and needs to be rescued or stopped before the next eclipse.",
                    "Plot Hook: The NPC was secretly hired by the mayor to investigate local corruption, and the rumor is a trap."
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
        const g = this.grammar;
        const fallbackLang = 'es';
        const intros = g.intros[lang] || g.intros[fallbackLang];
        const subjects = g.subjects[lang] || g.subjects[fallbackLang];
        const actions = g.actions[lang] || g.actions[fallbackLang];
        const locations = g.locations[lang] || g.locations[fallbackLang];
        const hooks = g.hooks[lang] || g.hooks[fallbackLang];

        const intro = intros[Math.floor(Math.random() * intros.length)];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const hookText = hooks[Math.floor(Math.random() * hooks.length)];

        let rumorText = `${intro} ${subject} ${action} ${location}`;

        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}
