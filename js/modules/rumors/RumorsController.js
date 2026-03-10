import RumorsModel from './RumorsModel.js';
import RumorsView from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.model = new RumorsModel();
        this.view = new RumorsView(container);
    }

    async init() {
        await this.model.load();
        this.view.render();
        this.view.updateVariables(this.model.variables);
        this.view.updateRumors(this.model.generatedRumors);
        this.attachEvents();
        console.log("🗣️ Controlador de Rumores: Listo.");
    }

    attachEvents() {
        const container = this.view.container;

        // Agregar variable con botón
        container.querySelectorAll('.btn-add-var').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                const input = container.querySelector(`#inp-${type}`);
                if (input && input.value) {
                    this.model.addVariable(type, input.value);
                    this.view.updateVariables(this.model.variables);
                }
            });
        });

        // Agregar variable con Enter
        container.querySelectorAll('input[id^="inp-"]').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const type = input.id.replace('inp-', '');
                    this.model.addVariable(type, input.value);
                    this.view.updateVariables(this.model.variables);
                }
            });
        });

        // Generar Rumor
        const btnGenerate = container.querySelector('#btn-generate-rumor');
        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                this.model.generateRumor();
                this.view.updateRumors(this.model.generatedRumors);
            });
        }

        // Delegación de eventos para eliminar variables y rumores
        container.addEventListener('click', (e) => {
            const btnDelVar = e.target.closest('.btn-del-var');
            if (btnDelVar) {
                const type = btnDelVar.dataset.type;
                const index = btnDelVar.dataset.index;
                this.model.removeVariable(type, parseInt(index));
                this.view.updateVariables(this.model.variables);
                return;
            }

            const btnDelRumor = e.target.closest('.btn-del-rumor');
            if (btnDelRumor) {
                const id = btnDelRumor.dataset.id;
                this.model.removeRumor(id);
                this.view.updateRumors(this.model.generatedRumors);
            }
        });
    }

    destroy() {
        if (this.view && this.view.container) {
            this.view.container.innerHTML = '';
        }
    }
}
