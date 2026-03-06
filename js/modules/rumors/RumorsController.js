import RumorsGenerator from './RumorsGenerator.js';
import RumorsView from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.container = container;
        this.generator = new RumorsGenerator();
        this.view = new RumorsView(this.container, this);
    }

    async init() {
        this.view.render();
    }

    generateRumor(context) {
        const cleanContext = Object.fromEntries(
            Object.entries(context).filter(([_, v]) => v != null && v !== '')
        );

        const newRumor = this.generator.generateRumor(cleanContext);
        this.view.addRumor(newRumor);
    }

    clearRumors() {
        this.view.clearList();
    }

    destroy() {
        this.container.innerHTML = '';
    }
}