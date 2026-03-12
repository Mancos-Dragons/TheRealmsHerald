export default class RumorsModel {
    constructor() {
        this.towns = ["Waterdeep", "Neverwinter", "Baldur's Gate", "Phandalin", "Icewind Dale"];
        this.characters = ["Elminster", "Drizzt Do'Urden", "Jarlaxle", "Volo", "Laeral Silverhand", "Un forastero misterioso"];
        this.roles = ["mago", "guerrero", "pícaro", "noble", "comerciante", "campesino", "guardia"];

        // Templates that use {town}, {character}, and {role} optionally.
        this.templates = [
            "Se dice que {character} fue visto en {town} buscando un artefacto perdido.",
            "Un {role} en {town} jura haber visto a {character} pactando con demonios.",
            "En las sombras de {town}, un {role} asegura que {character} planea un golpe de estado.",
            "Nadie en {town} confía en {character} después de lo que le hizo a ese {role}.",
            "Corren rumores de que {character} está reclutando a cualquier {role} dispuesto a viajar desde {town}.",
            "Un {role} borracho en {town} balbuceaba sobre un tesoro escondido por {character}.",
            "Han encontrado el cuerpo de un {role} en {town}. Todos sospechan de {character}.",
            "{character} ha puesto un precio por la cabeza de un {role} que huyó a {town}."
        ];
    }

    getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    generateRumor(customTown, customCharacter, customRole) {
        const town = customTown && customTown.trim() !== "" ? customTown : this.getRandomElement(this.towns);
        const character = customCharacter && customCharacter.trim() !== "" ? customCharacter : this.getRandomElement(this.characters);
        const role = customRole && customRole.trim() !== "" ? customRole : this.getRandomElement(this.roles);

        const template = this.getRandomElement(this.templates);

        let rumor = template
            .replace(/{town}/g, town)
            .replace(/{character}/g, character)
            .replace(/{role}/g, role);

        return rumor;
    }
}
