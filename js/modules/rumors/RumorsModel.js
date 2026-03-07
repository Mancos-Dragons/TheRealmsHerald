export default class RumorsModel {
    constructor() {
        this.variables = {
            townName: "Villa Refugio",
            characters: [
                { id: this.generateId(), name: "Thalor", role: "Tabernero" },
                { id: this.generateId(), name: "Elara", role: "Guardia" }
            ]
        };
        this.rumorsList = [];
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    addCharacter(name, role) {
        this.variables.characters.push({ id: this.generateId(), name, role });
    }

    deleteCharacter(id) {
        this.variables.characters = this.variables.characters.filter(c => c.id !== id);
    }

    addRumor(text, type = 'gossip') {
        const newRumor = {
            id: this.generateId(),
            text,
            type,
            used: false
        };
        this.rumorsList.unshift(newRumor); // Add to the top
    }

    toggleRumorUsed(id) {
        const rumor = this.rumorsList.find(r => r.id === id);
        if (rumor) {
            rumor.used = !rumor.used;
        }
    }

    deleteRumor(id) {
        this.rumorsList = this.rumorsList.filter(r => r.id !== id);
    }

    generateRumor() {
        // Procedural generation logic
        const actions = [
            "está buscando en secreto un artefacto cerca de",
            "tuvo una acalorada discusión con un desconocido anoche cerca de",
            "ha estado acaparando provisiones inusuales en",
            "fue visto hablando con figuras encapuchadas en las afueras de",
            "perdió algo muy valioso cerca de"
        ];

        const places = [
            "el bosque viejo",
            "las ruinas abandonadas",
            "el cruce de caminos del sur",
            "los muelles",
            "las alcantarillas"
        ];

        const { townName, characters } = this.variables;
        let subject = "Alguien";

        // Pick a random character if available
        if (characters && characters.length > 0) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            subject = `${char.name} el ${char.role}`;
        }

        const action = actions[Math.floor(Math.random() * actions.length)];
        const place = places[Math.floor(Math.random() * places.length)];

        // Randomly decide if it's just gossip or an event trigger
        const type = Math.random() > 0.7 ? 'event' : 'gossip';

        const text = `Se dice por ${townName} que ${subject} ${action} ${place}.`;

        return { text, type };
    }
}
