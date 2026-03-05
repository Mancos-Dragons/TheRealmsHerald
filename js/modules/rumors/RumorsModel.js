export default class RumorsModel {
    constructor() {
        this.defaultTown = "Pueblo Viejo";
        this.defaultNpcName = "Desconocido";
        this.defaultNpcRole = "Viajero";

        this.templates = [
            "Se dice que {npcName}, el {npcRole} de {townName}, fue visto haciendo tratos oscuros cerca del bosque viejo a medianoche.",
            "Algunos murmuran que {npcName} (el {npcRole}) sabe dónde está el tesoro perdido de {townName}, pero tiene demasiado miedo para hablar.",
            "Anoche hubo ruidos extraños en {townName}. Creen que {npcName}, nuestro {npcRole}, está invocando fuerzas que no comprende.",
            "Un mercader forastero llegó a {townName} preguntando específicamente por {npcName}, el {npcRole}. Parecía muy enojado.",
            "Dicen las malas lenguas en {townName} que {npcName}, el {npcRole}, no es quien dice ser y que en realidad es un espía del reino vecino."
        ];

        this.plotHooks = [
            "Gancho de Aventura: Si los jugadores investigan el área, encontrarán huellas misteriosas que llevan a una cueva oculta.",
            "Gancho de Aventura: El PNJ negará todo rotundamente y se pondrá a la defensiva si se le presiona, pero su diario contiene pistas vitales.",
            "Gancho de Aventura: Esto es solo un malentendido creado por un rival del PNJ para arruinar su reputación. El rival ofrecerá oro si los aventureros lo confirman.",
            "Gancho de Aventura: Los rumores son ciertos. El PNJ está bajo los efectos de un encantamiento y necesita ser rescatado o detenido antes del próximo eclipse."
        ];
    }

    generateRumor(townName, npcName, npcRole) {
        const town = townName || this.defaultTown;
        const name = npcName || this.defaultNpcName;
        const role = npcRole || this.defaultNpcRole;

        const templateIndex = Math.floor(Math.random() * this.templates.length);
        const hookIndex = Math.floor(Math.random() * this.plotHooks.length);

        let rumorText = this.templates[templateIndex];
        rumorText = rumorText.replace(/{townName}/g, town);
        rumorText = rumorText.replace(/{npcName}/g, name);
        rumorText = rumorText.replace(/{npcRole}/g, role);

        const hookText = this.plotHooks[hookIndex];

        return {
            rumor: rumorText,
            hook: hookText
        };
    }
}