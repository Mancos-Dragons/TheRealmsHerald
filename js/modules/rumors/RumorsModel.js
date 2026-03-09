import { DataService } from '../../services/DataService.js';

export default class RumorsModel {
    constructor() {
        this.townName = "";
        this.characters = [];
        this.rumorsList = [];
        this.STORAGE_KEY = 'trh_rumors_data';

        this.templates = [
            "Se dice que {role} {name} fue visto merodeando por el cementerio de {townName} a altas horas de la noche.",
            "He escuchado que {name} ha estado acumulando provisiones. ¿Sabrá algo que nosotros en {townName} ignoramos?",
            "Un mercader forastero asegura que {role} {name} le compró un veneno muy extraño ayer.",
            "Dicen las malas lenguas de {townName} que {name} está reuniendo gente para una rebelión secreta.",
            "Alguien encontró monedas antiguas cerca de la casa de {name}. ¿Habrá descubierto un tesoro?",
            "La última vez que vi a {role} {name}, estaba hablando con un encapuchado a las afueras de {townName}.",
            "Rumorean que {name} perdió una suma enorme de dinero apostando con la guardia local.",
            "¿Has notado lo pálido que está {name} últimamente? En {townName} dicen que hizo un pacto oscuro.",
            "Se comenta que {role} {name} encontró un artefacto brillante en el bosque cercano a {townName}.",
            "He visto a {name} marcando las puertas de varias casas en {townName} con tiza roja..."
        ];
    }

    async load() {
        const data = await DataService.load(this.STORAGE_KEY);
        if (data) {
            this.townName = data.townName || "";
            this.characters = data.characters || [];
            this.rumorsList = data.rumorsList || [];
        }
    }

    async save() {
        await DataService.save(this.STORAGE_KEY, {
            townName: this.townName,
            characters: this.characters,
            rumorsList: this.rumorsList
        });
    }

    setTownName(name) {
        this.townName = name;
        this.save();
    }

    addCharacter(name, role) {
        if (!name) return;
        this.characters.push({ name, role: role || "habitante" });
        this.save();
    }

    removeCharacter(index) {
        if (index >= 0 && index < this.characters.length) {
            this.characters.splice(index, 1);
            this.save();
        }
    }

    clearRumors() {
        this.rumorsList = [];
        this.save();
    }

    generateRumors(count = 5) {
        this.rumorsList = [];
        const town = this.townName || "el pueblo";

        if (this.characters.length === 0) {
            this.rumorsList.push("No hay nadie en el pueblo sobre quien rumorear...");
            return;
        }

        for (let i = 0; i < count; i++) {
            const template = this.templates[Math.floor(Math.random() * this.templates.length)];
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];

            let rumor = template
                .replace(/{name}/g, char.name)
                .replace(/{role}/g, char.role)
                .replace(/{townName}/g, town);

            this.rumorsList.push(rumor);
        }

        this.save();
    }

    getState() {
        return {
            townName: this.townName,
            characters: this.characters,
            rumorsList: this.rumorsList
        };
    }
}
