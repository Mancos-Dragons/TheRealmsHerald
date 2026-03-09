import { LanguageService } from '../../core/LanguageService.js';

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

export default class RumorsView {
    constructor(container) {
        this.container = container;
    }

    render(state) {
        const t = (key) => LanguageService.get(key);

        this.container.innerHTML = `
            <div class="container-fluid h-100 overflow-y-auto custom-scrollbar p-4 fade-in bg-[#0d0d0d]">
                <div class="row g-4 h-100">

                    <!-- Left Sidebar (Inputs) -->
                    <div class="col-md-4 col-lg-3 h-100">
                        <div class="card bg-[#161616] border border-[#333] shadow-lg h-100 d-flex flex-column">
                            <div class="card-header border-bottom border-[#333] p-3">
                                <h5 class="medieval-font text-amber-500 mb-0 d-flex align-items-center gap-2">
                                    <i class="ph ph-mask-happy"></i>
                                    <span data-i18n="rumors.ui.config">${t('rumors.ui.config') || 'Configuración'}</span>
                                </h5>
                            </div>
                            <div class="card-body overflow-y-auto custom-scrollbar d-flex flex-column gap-4">

                                <!-- Town Name -->
                                <div>
                                    <label class="form-label text-gray-400 text-sm" data-i18n="rumors.ui.town_name">${t('rumors.ui.town_name') || 'Nombre del Pueblo'}</label>
                                    <input type="text" id="town-name-input" class="form-control bg-[#111] text-gray-200 border-[#444] form-control-sm" placeholder="Ej. Villa Real" value="${escapeHTML(state.townName)}">
                                </div>

                                <!-- Add Character -->
                                <div class="bg-[#1a1a1a] p-3 rounded border border-[#333]">
                                    <h6 class="text-gray-300 text-sm mb-3 font-bold" data-i18n="rumors.ui.add_character">${t('rumors.ui.add_character') || 'Añadir Personaje'}</h6>

                                    <div class="mb-2">
                                        <input type="text" id="char-name-input" class="form-control bg-[#111] text-gray-200 border-[#444] form-control-sm mb-2" placeholder="${t('rumors.ui.character_name') || 'Nombre'}">
                                        <input type="text" id="char-role-input" class="form-control bg-[#111] text-gray-200 border-[#444] form-control-sm" placeholder="${t('rumors.ui.character_role') || 'Rol/Profesión'}">
                                    </div>
                                    <button id="add-char-btn" class="btn btn-sm btn-outline-warning w-100">
                                        <i class="ph ph-plus"></i> <span data-i18n="rumors.ui.add_btn">${t('rumors.ui.add_btn') || 'Añadir'}</span>
                                    </button>
                                </div>

                                <!-- Character List -->
                                <div class="flex-grow-1 d-flex flex-column min-h-[200px]">
                                    <h6 class="text-gray-300 text-sm mb-2 font-bold" data-i18n="rumors.ui.characters_list">${t('rumors.ui.characters_list') || 'Personajes Registrados'}</h6>
                                    <div id="character-list" class="flex-grow-1 overflow-y-auto pr-2 space-y-2">
                                        ${this.renderCharacterList(state.characters)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Right Main Area (Output) -->
                    <div class="col-md-8 col-lg-9 h-100">
                        <div class="card bg-[#111] border border-[#333] shadow-lg h-100 d-flex flex-column">
                            <div class="card-header border-bottom border-[#333] p-3 d-flex justify-content-between align-items-center">
                                <h4 class="medieval-font text-amber-500 mb-0 d-flex align-items-center gap-2">
                                    <i class="ph ph-scroll"></i>
                                    <span data-i18n="rumors.ui.rumors_board">${t('rumors.ui.rumors_board') || 'Tablón de Susurros'}</span>
                                </h4>
                                <div class="d-flex gap-2">
                                    <button id="clear-rumors-btn" class="btn btn-sm btn-outline-danger">
                                        <i class="ph ph-trash"></i> <span data-i18n="rumors.ui.clear_btn">${t('rumors.ui.clear_btn') || 'Limpiar'}</span>
                                    </button>
                                    <button id="generate-rumors-btn" class="btn btn-sm btn-warning">
                                        <i class="ph ph-magic-wand"></i> <span data-i18n="rumors.ui.generate_btn">${t('rumors.ui.generate_btn') || 'Generar Rumores'}</span>
                                    </button>
                                </div>
                            </div>

                            <div class="card-body overflow-y-auto custom-scrollbar p-4 bg-[url('../assets/textures/texture-clean.png')] bg-cover bg-center">
                                <div id="rumors-list" class="space-y-4">
                                    ${this.renderRumorsList(state.rumorsList)}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    renderCharacterList(characters) {
        if (!characters || characters.length === 0) {
            return `<div class="text-gray-600 text-xs italic p-2 text-center border border-dashed border-[#444] rounded">Ningún personaje añadido.</div>`;
        }
        return characters.map((char, index) => `
            <div class="d-flex justify-content-between align-items-center p-2 bg-[#222] border border-[#444] rounded hover:border-amber-700 transition-colors">
                <div>
                    <div class="text-sm text-gray-200 fw-bold">${escapeHTML(char.name)}</div>
                    <div class="text-xs text-gray-500">${escapeHTML(char.role)}</div>
                </div>
                <button class="btn btn-link text-danger p-0 delete-char-btn" data-index="${index}">
                    <i class="ph ph-x"></i>
                </button>
            </div>
        `).join('');
    }

    renderRumorsList(rumors) {
        if (!rumors || rumors.length === 0) {
            return `
                <div class="h-100 d-flex flex-column align-items-center justify-content-center text-center opacity-50 pt-5">
                    <i class="ph ph-mask-sad text-6xl text-gray-600 mb-3"></i>
                    <p class="medieval-font text-gray-500 text-xl">Las calles están en silencio...</p>
                    <p class="text-sm text-gray-600">Añade personajes y presiona "Generar Rumores"</p>
                </div>
            `;
        }
        return rumors.map(rumor => `
            <div class="p-4 bg-[#1a1a1a]/90 backdrop-blur border-l-4 border-amber-600 rounded shadow-md d-flex gap-3 align-items-start fade-in">
                <i class="ph ph-quotes text-amber-600 text-2xl opacity-50 mt-1 shrink-0"></i>
                <div class="text-gray-300 font-serif fs-5 fst-italic leading-relaxed">
                    "${escapeHTML(rumor)}"
                </div>
            </div>
        `).join('');
    }

    updateCharacterList(characters) {
        const listEl = this.container.querySelector('#character-list');
        if (listEl) {
            listEl.innerHTML = this.renderCharacterList(characters);
        }
    }

    updateRumorsList(rumors) {
        const listEl = this.container.querySelector('#rumors-list');
        if (listEl) {
            listEl.innerHTML = this.renderRumorsList(rumors);
        }
    }

    bindTownNameChange(handler) {
        const input = this.container.querySelector('#town-name-input');
        if (input) {
            input.addEventListener('change', (e) => handler(e.target.value));
        }
    }

    bindAddCharacter(handler) {
        const btn = this.container.querySelector('#add-char-btn');
        const nameInput = this.container.querySelector('#char-name-input');
        const roleInput = this.container.querySelector('#char-role-input');

        if (btn && nameInput && roleInput) {
            btn.addEventListener('click', () => {
                handler(nameInput.value.trim(), roleInput.value.trim());
                nameInput.value = '';
                roleInput.value = '';
                nameInput.focus();
            });
            roleInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    btn.click();
                }
            });
        }
    }

    bindDeleteCharacter(handler) {
        const list = this.container.querySelector('#character-list');
        if (list) {
            list.addEventListener('click', (e) => {
                const btn = e.target.closest('.delete-char-btn');
                if (btn) {
                    const index = parseInt(btn.dataset.index, 10);
                    handler(index);
                }
            });
        }
    }

    bindGenerateRumors(handler) {
        const btn = this.container.querySelector('#generate-rumors-btn');
        if (btn) {
            btn.addEventListener('click', () => handler());
        }
    }

    bindClearRumors(handler) {
        const btn = this.container.querySelector('#clear-rumors-btn');
        if (btn) {
            btn.addEventListener('click', () => handler());
        }
    }
}
