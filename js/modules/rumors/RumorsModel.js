export default class RumorsModel {
    constructor() {
        this.townName = "";
        this.characters = []; // { id, name, role }
        this.locations = []; // { id, name }
        this.rumors = []; // { id, text, isTrue, source, status }

        // Basic templates for the procedural generation
        this.templates = [
            "¿Escuchaste sobre {character}? Dicen que está tratando con contrabandistas en {location}.",
            "La gente de {town} está aterrorizada. Aseguran haber visto algo extraño cerca de {location}.",
            "Me contaron que {character} está buscando aventureros para una tarea secreta.",
            "Dicen que hay un tesoro escondido en {location}, pero {character} tiene la llave.",
            "Las cosas en {town} están empeorando, ayer vi a {character} actuando de forma muy sospechosa."
        ];
    }

    async load() {
        try {
            const data = localStorage.getItem('herald_rumors');
            if (data) {
                const parsed = JSON.parse(data);
                this.townName = parsed.townName || "";
                this.characters = parsed.characters || [];
                this.locations = parsed.locations || [];
                this.rumors = parsed.rumors || [];
            }
        } catch (e) {
            console.error("Error loading rumors data", e);
        }
    }

    save() {
        const data = {
            townName: this.townName,
            characters: this.characters,
            locations: this.locations,
            rumors: this.rumors
        };
        localStorage.setItem('herald_rumors', JSON.stringify(data));
    }

    addCharacter(name, role) {
        const id = 'char_' + Date.now();
        this.characters.push({ id, name, role });
        this.save();
        return id;
    }

    deleteCharacter(id) {
        this.characters = this.characters.filter(c => c.id !== id);
        this.save();
    }

    addLocation(name) {
        const id = 'loc_' + Date.now();
        this.locations.push({ id, name });
        this.save();
        return id;
    }

    deleteLocation(id) {
        this.locations = this.locations.filter(l => l.id !== id);
        this.save();
    }

    setTownName(name) {
        this.townName = name;
        this.save();
    }

    generateRumor() {
        if (this.templates.length === 0) return null;

        const template = this.templates[Math.floor(Math.random() * this.templates.length)];

        let text = template;

        const character = this.characters.length > 0
            ? this.characters[Math.floor(Math.random() * this.characters.length)]
            : { name: "alguien misterioso" };

        const location = this.locations.length > 0
            ? this.locations[Math.floor(Math.random() * this.locations.length)]
            : { name: "las afueras" };

        const town = this.townName || "el pueblo";

        text = text.replace(/\{character\}/g, character.name);
        text = text.replace(/\{location\}/g, location.name);
        text = text.replace(/\{town\}/g, town);

        const rumor = {
            id: 'rumor_' + Date.now(),
            text,
            isTrue: Math.random() > 0.5,
            source: "Anónimo",
            status: "active"
        };

        this.rumors.unshift(rumor);
        this.save();

        return rumor;
    }

    updateRumor(id, updates) {
        const rumor = this.rumors.find(r => r.id === id);
        if (rumor) {
            Object.assign(rumor, updates);
            this.save();
        }
    }

    deleteRumor(id) {
        this.rumors = this.rumors.filter(r => r.id !== id);
        this.save();
    }
}
