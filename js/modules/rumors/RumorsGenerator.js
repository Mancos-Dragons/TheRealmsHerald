import { LanguageService } from '../../core/LanguageService.js';
import { escapeHTML } from '../../core/DOMHelper.js';

export default class RumorsGenerator {
    constructor() {
        // En un caso real estos podrían venir de un JSON de datos pre-cargados o generados dinámicamente.
        // Aquí los internacionalizamos en el momento de generación para que se correspondan con el idioma activo
    }

    getTemplates() {
        return [
            LanguageService.get('rumors.gen.template.1'),
            LanguageService.get('rumors.gen.template.2'),
            LanguageService.get('rumors.gen.template.3'),
            LanguageService.get('rumors.gen.template.4'),
            LanguageService.get('rumors.gen.template.5'),
            LanguageService.get('rumors.gen.template.6'),
            LanguageService.get('rumors.gen.template.7'),
            LanguageService.get('rumors.gen.template.8'),
            LanguageService.get('rumors.gen.template.9'),
            LanguageService.get('rumors.gen.template.10')
        ];
    }

    getSubjects() {
        return {
            characters: [
                LanguageService.get('rumors.gen.char.1'),
                LanguageService.get('rumors.gen.char.2'),
                LanguageService.get('rumors.gen.char.3'),
                LanguageService.get('rumors.gen.char.4'),
                LanguageService.get('rumors.gen.char.5'),
                LanguageService.get('rumors.gen.char.6'),
                LanguageService.get('rumors.gen.char.7'),
                LanguageService.get('rumors.gen.char.8'),
                LanguageService.get('rumors.gen.char.9'),
                LanguageService.get('rumors.gen.char.10')
            ],
            locations: [
                LanguageService.get('rumors.gen.loc.1'),
                LanguageService.get('rumors.gen.loc.2'),
                LanguageService.get('rumors.gen.loc.3'),
                LanguageService.get('rumors.gen.loc.4'),
                LanguageService.get('rumors.gen.loc.5'),
                LanguageService.get('rumors.gen.loc.6'),
                LanguageService.get('rumors.gen.loc.7'),
                LanguageService.get('rumors.gen.loc.8'),
                LanguageService.get('rumors.gen.loc.9'),
                LanguageService.get('rumors.gen.loc.10')
            ],
            objects: [
                LanguageService.get('rumors.gen.obj.1'),
                LanguageService.get('rumors.gen.obj.2'),
                LanguageService.get('rumors.gen.obj.3'),
                LanguageService.get('rumors.gen.obj.4'),
                LanguageService.get('rumors.gen.obj.5'),
                LanguageService.get('rumors.gen.obj.6'),
                LanguageService.get('rumors.gen.obj.7'),
                LanguageService.get('rumors.gen.obj.8'),
                LanguageService.get('rumors.gen.obj.9'),
                LanguageService.get('rumors.gen.obj.10')
            ],
            creatures: [
                LanguageService.get('rumors.gen.crea.1'),
                LanguageService.get('rumors.gen.crea.2'),
                LanguageService.get('rumors.gen.crea.3'),
                LanguageService.get('rumors.gen.crea.4'),
                LanguageService.get('rumors.gen.crea.5'),
                LanguageService.get('rumors.gen.crea.6'),
                LanguageService.get('rumors.gen.crea.7'),
                LanguageService.get('rumors.gen.crea.8'),
                LanguageService.get('rumors.gen.crea.9'),
                LanguageService.get('rumors.gen.crea.10')
            ]
        };
    }

    generateRumor(customContext = {}) {
        const templates = this.getTemplates();
        const subjects = this.getSubjects();

        let template = this.getRandomItem(templates);

        let character = escapeHTML(customContext.character || this.getRandomItem(subjects.characters));
        let location = escapeHTML(customContext.location || this.getRandomItem(subjects.locations));
        let object = escapeHTML(customContext.object || this.getRandomItem(subjects.objects));
        let creature = escapeHTML(customContext.creature || this.getRandomItem(subjects.creatures));

        let rumor = template
            .replace('{character}', `<strong class="text-amber-500">${character}</strong>`)
            .replace('{location}', `<strong class="text-blue-400">${location}</strong>`)
            .replace('{object}', `<strong class="text-purple-400">${object}</strong>`)
            .replace('{creature}', `<strong class="text-red-400">${creature}</strong>`);

        return {
            text: rumor,
            truthLevel: this.getRandomTruthLevel()
        };
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomTruthLevel() {
        const levels = [
            { label: "Mentira Absoluta", color: "text-red-500" },
            { label: "Poco Probable", color: "text-orange-400" },
            { label: "Dudoso", color: "text-yellow-400" },
            { label: "Posiblemente Cierto", color: "text-green-400" },
            { label: "Verdad Innegable", color: "text-green-600" }
        ];
        return this.getRandomItem(levels);
    }
}