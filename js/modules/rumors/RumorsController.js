import { RumorsModel } from './RumorsModel.js';
import { RumorsView } from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.container = container;
        this.model = new RumorsModel();
        this.view = new RumorsView(container);
    }

    async init() {
        this.view.render();
        this.attachEvents();
    }

    attachEvents() {
        const generateBtn = this.container.querySelector('#btn-generate-rumor');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.handleGenerateRumor();
            });
        }
    }

    handleGenerateRumor() {
        const customContext = this.view.getCustomContext();

        // Clean up empty strings to undefined so model uses defaults if empty
        const contextObj = {};
        if (customContext.subject) contextObj.subject = customContext.subject;
        if (customContext.location) contextObj.location = customContext.location;

        const generatedData = this.model.generateRumor(contextObj);

        this.view.renderRumor(generatedData);
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
