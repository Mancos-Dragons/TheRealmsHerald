import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsView {
    constructor(container) {
        this.container = container;
        this.t = (key) => LanguageService.get(key);
    }

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    render() {
        this.container.innerHTML = `
            <div class="container-fluid h-100 d-flex flex-column fade-in p-0">
                <div class="bg-[#111] border-bottom border-[#333] p-3 d-flex justify-content-between align-items-center shrink-0">
                    <h2 class="medieval-font text-amber-500 m-0 d-flex align-items-center gap-2">
                        <i class="ph ph-mask-happy text-3xl"></i>
                        <span data-i18n="rumors.title">${this.t('rumors.title')}</span>
                    </h2>
                </div>

                <div class="row flex-grow-1 m-0 overflow-hidden">
                    <!-- Sidebar: Variables -->
                    <div class="col-md-4 col-lg-3 bg-[#1a1a1a] border-end border-[#333] p-4 overflow-y-auto custom-scrollbar">
                        <h5 class="text-amber-600 mb-4 medieval-font border-bottom border-[#444] pb-2" data-i18n="rumors.variables">
                            ${this.t('rumors.variables')}
                        </h5>

                        <div id="variables-container">
                            ${this.renderVariableSection('towns', 'rumors.town', 'ph-buildings')}
                            ${this.renderVariableSection('npcs', 'rumors.npc', 'ph-user')}
                            ${this.renderVariableSection('locations', 'rumors.location', 'ph-map-pin')}
                            ${this.renderVariableSection('items', 'rumors.item', 'ph-sword')}
                        </div>
                    </div>

                    <!-- Main Content: Generation -->
                    <div class="col-md-8 col-lg-9 bg-[#0d0d0d] p-4 overflow-y-auto custom-scrollbar d-flex flex-column">
                        <div class="text-center mb-5 mt-3">
                            <button id="btn-generate-rumor" class="btn btn-warning btn-lg px-5 shadow-lg hover-scale">
                                <i class="ph ph-sparkle"></i> <span data-i18n="rumors.generate">${this.t('rumors.generate')}</span>
                            </button>
                        </div>

                        <h4 class="text-gray-400 mb-3 border-bottom border-[#333] pb-2" data-i18n="rumors.result">
                            ${this.t('rumors.result')}
                        </h4>

                        <div id="rumors-list" class="flex-grow-1">
                            <!-- Generated rumors go here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderVariableSection(type, titleKey, icon) {
        return `
            <div class="mb-4">
                <label class="form-label text-gray-300 text-sm fw-bold d-flex align-items-center gap-2">
                    <i class="ph ${icon} text-amber-500"></i> <span data-i18n="${titleKey}">${this.t(titleKey)}</span>
                </label>
                <div class="input-group input-group-sm mb-2">
                    <input type="text" id="inp-${type}" class="form-control bg-black text-white border-secondary" placeholder="...">
                    <button class="btn btn-outline-warning btn-add-var" data-type="${type}" type="button">
                        <i class="ph ph-plus"></i>
                    </button>
                </div>
                <ul id="list-${type}" class="list-group list-group-flush rounded border border-[#333]">
                </ul>
            </div>
        `;
    }

    updateVariables(variables) {
        ['towns', 'npcs', 'locations', 'items'].forEach(type => {
            const listEl = this.container.querySelector(`#list-${type}`);
            if (!listEl) return;

            listEl.innerHTML = variables[type].map((val, index) => `
                <li class="list-group-item bg-[#111] text-gray-300 border-[#333] d-flex justify-content-between align-items-center px-2 py-1 text-sm">
                    <span class="text-truncate">${this.escapeHTML(val)}</span>
                    <button class="btn btn-link text-danger p-0 ms-2 btn-del-var hover-scale" data-type="${type}" data-index="${index}" title="${this.t('rumors.delete')}">
                        <i class="ph ph-trash"></i>
                    </button>
                </li>
            `).join('');

            // clear input
            const inp = this.container.querySelector(`#inp-${type}`);
            if (inp) inp.value = '';
        });
    }

    updateRumors(rumors) {
        const listEl = this.container.querySelector('#rumors-list');
        if (!listEl) return;

        if (rumors.length === 0) {
            listEl.innerHTML = `
                <div class="text-center text-gray-600 mt-5">
                    <i class="ph ph-empty text-5xl mb-2"></i>
                    <p data-i18n="rumors.no_data">${this.t('rumors.no_data')}</p>
                </div>`;
            return;
        }

        listEl.innerHTML = rumors.map(rumor => {
            const dateStr = new Date(rumor.date).toLocaleString(LanguageService.currentLang);
            return `
                <div class="card bg-[#161616] border border-[#333] mb-3 fade-in">
                    <div class="card-body position-relative pe-5">
                        <button class="btn btn-link text-danger position-absolute top-0 end-0 m-2 p-1 btn-del-rumor hover-scale" data-id="${rumor.id}" title="${this.t('rumors.delete')}">
                            <i class="ph ph-x-circle text-xl"></i>
                        </button>
                        <p class="card-text text-gray-200 fs-5 mb-2 font-serif italic text-amber-50">
                            "${this.escapeHTML(rumor.text)}"
                        </p>
                        <small class="text-gray-600">
                            <i class="ph ph-clock"></i> ${dateStr}
                        </small>
                    </div>
                </div>
            `;
        }).join('');
    }
}
