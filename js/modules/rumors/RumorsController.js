import RumorsModel from './RumorsModel.js';
import RumorsView from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.container = container;
        this.model = new RumorsModel();
        this.view = new RumorsView(container);
    }

    async init() {
        this.view.render();
        this.attachEvents();
        console.log("🗣️ Controlador de Susurros de Taberna: Listo.");
    }

    attachEvents() {
        const btnGenerate = this.container.querySelector('#btn-generate-rumor');
        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                this.handleGenerateRumor();
            });
        }

        const btnClear = this.container.querySelector('#btn-clear-rumors');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                this.view.clearRumors();
            });
        }
    }

    handleGenerateRumor() {
        const townInput = this.container.querySelector('#inp-town')?.value || "";
        const characterInput = this.container.querySelector('#inp-character')?.value || "";
        const roleInput = this.container.querySelector('#inp-role')?.value || "";

        const generatedRumor = this.model.generateRumor(townInput, characterInput, roleInput);
        this.view.renderRumor(generatedRumor);
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
