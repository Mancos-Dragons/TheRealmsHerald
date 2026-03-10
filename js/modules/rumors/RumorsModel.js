import { DataService } from '../../services/DataService.js';

export default class RumorsModel {
    constructor() {
        this.variables = {
            towns: [],
            npcs: [],
            locations: [],
            items: []
        };
        this.generatedRumors = [];
    }

    async load() {
        const savedVariables = DataService.load('herald_rumors_vars');
        if (savedVariables) {
            this.variables = savedVariables;
        }

        const savedRumors = DataService.load('herald_rumors_generated');
        if (savedRumors) {
            this.generatedRumors = savedRumors;
        }
    }

    save() {
        DataService.save('herald_rumors_vars', this.variables);
        DataService.save('herald_rumors_generated', this.generatedRumors);
    }

    addVariable(type, value) {
        if (this.variables[type] && value.trim() !== '') {
            this.variables[type].push(value.trim());
            this.save();
        }
    }

    removeVariable(type, index) {
        if (this.variables[type] && this.variables[type][index] !== undefined) {
            this.variables[type].splice(index, 1);
            this.save();
        }
    }

    removeRumor(id) {
        this.generatedRumors = this.generatedRumors.filter(r => r.id !== id);
        this.save();
    }

    generateRumor() {
        const templates = [
            "Dicen que [npc] fue visto cerca de [location] buscando desesperadamente [item].",
            "Los mercaderes afirman que en [town] la guardia está confiscando cada [item] que encuentran por orden de [npc].",
            "Un viajero de [town] asegura que [npc] ha hecho un pacto oscuro en [location].",
            "La taberna entera murmura sobre un tesoro escondido: [item] se encuentra oculto en algún lugar de [location].",
            "Se ofrece una gran recompensa en [town] a quien recupere [item] robado de [location].",
            "Alguien vio a [npc] salir a escondidas hacia [location] llevando consigo [item]."
        ];

        const enTemplates = [
            "They say [npc] was seen near [location] desperately looking for [item].",
            "Merchants claim that in [town] the guard is confiscating every [item] they find by order of [npc].",
            "A traveler from [town] swears that [npc] made a dark pact at [location].",
            "The whole tavern murmurs about a hidden treasure: [item] is hidden somewhere in [location].",
            "A great reward is offered in [town] to anyone who recovers [item] stolen from [location].",
            "Someone saw [npc] sneaking out towards [location] carrying [item]."
        ];

        // determine lang from document if possible
        const isEnglish = document.querySelector('[data-bs-theme]')?.lang === 'en' || (window.LanguageService && window.LanguageService.currentLang === 'en');
        const activeTemplates = isEnglish ? enTemplates : templates;

        const getRandom = (arr, fallback) => {
            if (!arr || arr.length === 0) return fallback;
            return arr[Math.floor(Math.random() * arr.length)];
        };

        const template = getRandom(activeTemplates, "Someone heard a weird sound.");

        let text = template
            .replace(/\[town\]/g, getRandom(this.variables.towns, "el pueblo vecino") )
            .replace(/\[npc\]/g, getRandom(this.variables.npcs, "un extraño") )
            .replace(/\[location\]/g, getRandom(this.variables.locations, "el bosque oscuro") )
            .replace(/\[item\]/g, getRandom(this.variables.items, "un artefacto misterioso") );

        // English fallback strings
        if (isEnglish) {
            text = template
                .replace(/\[town\]/g, getRandom(this.variables.towns, "the neighboring town") )
                .replace(/\[npc\]/g, getRandom(this.variables.npcs, "a stranger") )
                .replace(/\[location\]/g, getRandom(this.variables.locations, "the dark forest") )
                .replace(/\[item\]/g, getRandom(this.variables.items, "a mysterious artifact") );
        }

        const newRumor = {
            id: Date.now().toString(),
            text: text,
            date: new Date().toISOString()
        };

        this.generatedRumors.unshift(newRumor);
        this.save();
        return newRumor;
    }
}
