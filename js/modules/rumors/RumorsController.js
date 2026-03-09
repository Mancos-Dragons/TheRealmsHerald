import RumorsModel from './RumorsModel.js';
import RumorsView from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.model = new RumorsModel();
        this.view = new RumorsView(container);
    }

    async init() {
        await this.model.load();

        this.view.render(this.model.getState());
        this.bindEvents();
    }

    bindEvents() {
        this.view.bindTownNameChange((name) => {
            this.model.setTownName(name);
        });

        this.view.bindAddCharacter((name, role) => {
            if (name) {
                this.model.addCharacter(name, role);
                this.view.updateCharacterList(this.model.getState().characters);
            }
        });

        this.view.bindDeleteCharacter((index) => {
            this.model.removeCharacter(index);
            this.view.updateCharacterList(this.model.getState().characters);
        });

        this.view.bindGenerateRumors(() => {
            this.model.generateRumors(5);
            this.view.updateRumorsList(this.model.getState().rumorsList);
        });

        this.view.bindClearRumors(() => {
            this.model.clearRumors();
            this.view.updateRumorsList(this.model.getState().rumorsList);
        });
    }

    destroy() {
        this.view.container.innerHTML = '';
    }
}
