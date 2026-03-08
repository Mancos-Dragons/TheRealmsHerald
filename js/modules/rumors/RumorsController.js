import RumorsModel from './RumorsModel.js';
import RumorsView from './RumorsView.js';

export default class RumorsController {
    constructor(container) {
        this.model = new RumorsModel();
        this.view = new RumorsView(container);
    }

    async init() {
        await this.model.load();
        this.view.renderWorkspace(this.model);
        this.attachEvents();
        console.log("🍻 Controlador de Rumores: Listo.");
    }

    attachEvents() {
        // Town Name
        const townInput = document.getElementById('inp-town-name');
        if (townInput) {
            townInput.addEventListener('change', (e) => {
                this.model.setTownName(e.target.value);
            });
        }

        // Add Character
        const btnAddChar = document.getElementById('btn-add-char');
        if (btnAddChar) {
            btnAddChar.addEventListener('click', () => {
                const name = document.getElementById('inp-char-name').value.trim();
                const role = document.getElementById('inp-char-role').value.trim();
                if (name) {
                    this.model.addCharacter(name, role);
                    this.view.renderCharacters(this.model.characters);
                    this.view.clearCharInputs();
                    this.attachListEvents(); // re-attach delete buttons
                }
            });
        }

        // Add Location
        const btnAddLoc = document.getElementById('btn-add-loc');
        if (btnAddLoc) {
            btnAddLoc.addEventListener('click', () => {
                const name = document.getElementById('inp-loc-name').value.trim();
                if (name) {
                    this.model.addLocation(name);
                    this.view.renderLocations(this.model.locations);
                    this.view.clearLocInput();
                    this.attachListEvents();
                }
            });
        }

        // Generate Rumor
        const btnGenerate = document.getElementById('btn-generate-rumor');
        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                const rumor = this.model.generateRumor();
                if (rumor) {
                    this.view.renderRumors(this.model.rumors);
                    this.attachRumorEvents();
                }
            });
        }

        // Initial attachment
        this.attachListEvents();
        this.attachRumorEvents();
    }

    attachListEvents() {
        document.querySelectorAll('.btn-del-char').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                this.model.deleteCharacter(id);
                this.view.renderCharacters(this.model.characters);
                this.attachListEvents();
            };
        });

        document.querySelectorAll('.btn-del-loc').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                this.model.deleteLocation(id);
                this.view.renderLocations(this.model.locations);
                this.attachListEvents();
            };
        });
    }

    attachRumorEvents() {
        document.querySelectorAll('.btn-del-rumor').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                this.model.deleteRumor(id);
                this.view.renderRumors(this.model.rumors);
                this.attachRumorEvents();
            };
        });

        document.querySelectorAll('.btn-toggle-truth').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const rumor = this.model.rumors.find(r => r.id === id);
                if (rumor) {
                    this.model.updateRumor(id, { isTrue: !rumor.isTrue });
                    this.view.renderRumors(this.model.rumors);
                    this.attachRumorEvents();
                }
            };
        });

        document.querySelectorAll('.btn-status-toggle').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.currentTarget.dataset.id;
                const rumor = this.model.rumors.find(r => r.id === id);
                if (rumor) {
                    const newStatus = rumor.status === 'active' ? 'resolved' : 'active';
                    this.model.updateRumor(id, { status: newStatus });
                    this.view.renderRumors(this.model.rumors);
                    this.attachRumorEvents();
                }
            };
        });

        document.querySelectorAll('.source-edit').forEach(el => {
            el.onblur = (e) => {
                const id = e.currentTarget.dataset.id;
                const newSource = e.currentTarget.innerText.trim();
                this.model.updateRumor(id, { source: newSource });
            };
            el.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    el.blur();
                }
            };
        });
    }

    destroy() {
        if (this.view && this.view.container) {
            this.view.container.innerHTML = '';
        }
    }
}
