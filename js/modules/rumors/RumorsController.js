import RumorsModel from './RumorsModel.js';
import RumorsView from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.model = new RumorsModel();
        this.view = new RumorsView(container);
    }

    async init() {
        console.log("🗣️ Controlador de Rumores: Inicializando...");
        this.view.render(this.model.variables, this.model.rumorsList);
        this.attachEvents();
    }

    attachEvents() {
        // Formulario de variables
        const formVariables = this.view.container.querySelector('#form-variables');
        if (formVariables) {
            formVariables.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUpdateVariables();
            });
        }

        // Agregar un personaje a la lista
        const btnAddCharacter = this.view.container.querySelector('#btn-add-character');
        if (btnAddCharacter) {
            btnAddCharacter.addEventListener('click', () => {
                this.handleAddCharacter();
            });
        }

        // Delegación de eventos para eliminar personajes
        const charactersList = this.view.container.querySelector('#characters-list');
        if (charactersList) {
            charactersList.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.btn-delete-character');
                if (deleteBtn) {
                    const id = deleteBtn.dataset.id;
                    this.handleDeleteCharacter(id);
                }
            });
        }

        // Generar rumor
        const btnGenerate = this.view.container.querySelector('#btn-generate-rumor');
        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                this.handleGenerateRumor();
            });
        }

        // Delegación de eventos para la lista de rumores (Marcar como usado / Eliminar)
        const rumorsContainer = this.view.container.querySelector('#rumors-container');
        if (rumorsContainer) {
            rumorsContainer.addEventListener('click', (e) => {
                const btnToggleUsed = e.target.closest('.btn-toggle-used');
                if (btnToggleUsed) {
                    const id = btnToggleUsed.dataset.id;
                    this.model.toggleRumorUsed(id);
                    this.refreshRumorsList();
                }

                const btnDeleteRumor = e.target.closest('.btn-delete-rumor');
                if (btnDeleteRumor) {
                    const id = btnDeleteRumor.dataset.id;
                    this.model.deleteRumor(id);
                    this.refreshRumorsList();
                }
            });
        }
    }

    handleUpdateVariables() {
        const townNameInput = this.view.container.querySelector('#inp-town-name');
        if (townNameInput) {
            this.model.variables.townName = townNameInput.value;
        }
        // Save the model (if persistence is implemented)
        console.log("Variables actualizadas:", this.model.variables);
        // Note: we update the character via handleAddCharacter
    }

    handleAddCharacter() {
        const charNameInput = this.view.container.querySelector('#inp-char-name');
        const charRoleInput = this.view.container.querySelector('#inp-char-role');

        const name = charNameInput.value.trim();
        const role = charRoleInput.value.trim();

        if (name) {
            this.model.addCharacter(name, role);
            charNameInput.value = '';
            charRoleInput.value = '';
            this.refreshVariablesList();
        }
    }

    handleDeleteCharacter(id) {
        this.model.deleteCharacter(id);
        this.refreshVariablesList();
    }

    handleGenerateRumor() {
        // Asegurarse de tener las últimas variables guardadas
        this.handleUpdateVariables();

        const newRumor = this.model.generateRumor();
        if (newRumor) {
            this.model.addRumor(newRumor.text, newRumor.type);
            this.refreshRumorsList();
        }
    }

    refreshVariablesList() {
        this.view.renderCharactersList(this.model.variables.characters);
    }

    refreshRumorsList() {
        this.view.renderRumorsList(this.model.rumorsList);
    }

    destroy() {
        if (this.view && this.view.container) {
            this.view.container.innerHTML = '';
        }
    }
}
