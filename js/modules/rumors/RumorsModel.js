import { LanguageService } from '../../core/LanguageService.js';

export class RumorsModel {
    constructor() {
        // Data sources could be expanded or loaded from external JSON eventually
        this.data = {
            es: {
                subjects: [
                    "El alcalde", "El herrero local", "Un grupo de mercenarios", "La suma sacerdotisa",
                    "El posadero", "Una figura encapuchada", "Un niño del pueblo", "Un noble visitante",
                    "El capitán de la guardia", "Un comerciante rico", "El sepulturero", "La bruja del bosque",
                    "El bardo ciego", "Un veterano de guerra", "Una manada de lobos huargos"
                ],
                actions: [
                    "fue visto enterrando algo misterioso cerca de",
                    "está ofreciendo una recompensa enorme por explorar",
                    "se niega rotundamente a acercarse a",
                    "desapareció sin dejar rastro después de visitar",
                    "encontró un artefacto brillante en",
                    "hizo un pacto oscuro en",
                    "está planeando una rebelión en",
                    "compró una gran cantidad de armas oxidadas en",
                    "fue atacado por criaturas extrañas cerca de",
                    "descubrió una red de túneles secretos bajo",
                    "afirma haber visto un fantasma en",
                    "está recolectando ingredientes extraños de"
                ],
                locations: [
                    "las ruinas antiguas", "el bosque prohibido", "las catacumbas debajo del templo",
                    "el cementerio viejo", "la torre abandonada", "el puerto marítimo",
                    "las minas cerradas", "el pantano susurrante", "el mercado negro",
                    "la plaza principal", "el callejón de los ladrones", "la montaña nevada"
                ],
                consequences: [
                    "y ahora nadie se atreve a salir de noche.",
                    "y dicen que quien descubra la verdad se hará inmensamente rico.",
                    "pero la guardia de la ciudad está intentando encubrirlo.",
                    "y los cuervos no dejan de graznar sobre ese lugar.",
                    "y anoche el cielo se iluminó con luces antinaturales.",
                    "y algunos temen que sea un presagio de guerra.",
                    "y están buscando aventureros valientes para investigar.",
                    "pero el precio de la magia siempre es alto.",
                    "y extraños símbolos han aparecido en las puertas.",
                    "y se rumorea que volverá pronto a por venganza."
                ]
            },
            en: {
                subjects: [
                    "The mayor", "The local blacksmith", "A group of mercenaries", "The high priestess",
                    "The innkeeper", "A hooded figure", "A village child", "A visiting noble",
                    "The captain of the guard", "A wealthy merchant", "The gravedigger", "The witch of the woods",
                    "The blind bard", "A war veteran", "A pack of dire wolves"
                ],
                actions: [
                    "was seen burying something mysterious near",
                    "is offering a huge reward for exploring",
                    "flatly refuses to go anywhere near",
                    "disappeared without a trace after visiting",
                    "found a glowing artifact in",
                    "made a dark pact at",
                    "is planning a rebellion in",
                    "bought a large quantity of rusted weapons in",
                    "was attacked by strange creatures near",
                    "discovered a network of secret tunnels under",
                    "claims to have seen a ghost at",
                    "is collecting strange ingredients from"
                ],
                locations: [
                    "the ancient ruins", "the forbidden forest", "the catacombs beneath the temple",
                    "the old graveyard", "the abandoned tower", "the seaport",
                    "the closed mines", "the whispering swamp", "the black market",
                    "the main square", "Thieves' Alley", "the snowy mountain"
                ],
                consequences: [
                    "and now no one dares to go out at night.",
                    "and they say whoever finds the truth will become immensely rich.",
                    "but the city guard is trying to cover it up.",
                    "and the crows won't stop cawing over that place.",
                    "and last night the sky lit up with unnatural lights.",
                    "and some fear it is an omen of war.",
                    "and they are looking for brave adventurers to investigate.",
                    "but the price of magic is always high.",
                    "and strange symbols have appeared on the doors.",
                    "and rumor has it they will return soon for revenge."
                ]
            }
        };
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generateRumor(customContext = {}) {
        const lang = LanguageService.currentLang;
        const source = this.data[lang] || this.data['en']; // Fallback to English

        // Use custom variables if provided, otherwise pick random from lists
        const subject = customContext.subject || this.getRandomElement(source.subjects);
        const action = this.getRandomElement(source.actions);
        const location = customContext.location || this.getRandomElement(source.locations);
        const consequence = this.getRandomElement(source.consequences);

        const rumorText = `${subject} ${action} ${location} ${consequence}`;

        return {
            text: rumorText,
            timestamp: new Date().toISOString(),
            context: { ...customContext }
        };
    }
}
