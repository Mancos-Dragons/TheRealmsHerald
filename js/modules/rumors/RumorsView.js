import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsView {
    constructor(container, controller) {
        this.container = container;
        this.controller = controller;
        this.rumorsList = null;
    }

    render() {
        const t = (key) => LanguageService.get(key) || key;

        this.container.innerHTML = `
            <div class="h-100 d-flex flex-column bg-[#0d0d0d] fade-in">
                <!-- Header -->
                <header class="bg-[#111] border-bottom border-[#333] p-4 shrink-0 d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="medieval-font text-amber-500 m-0 d-flex align-items-center gap-2">
                            <i class="ph ph-mask-happy text-3xl"></i>
                            <span data-i18n="rumors.title">${t('rumors.title')}</span>
                        </h2>
                        <p class="text-gray-500 text-sm m-0" data-i18n="rumors.subtitle">${t('rumors.subtitle')}</p>
                    </div>
                </header>

                <!-- Workspace -->
                <div class="flex-1 overflow-hidden d-flex">
                    <!-- Sidebar: Inputs -->
                    <div class="w-80 bg-[#161616] border-end border-[#333] d-flex flex-column custom-scrollbar overflow-y-auto">
                        <div class="p-4">
                            <h5 class="text-amber-600 medieval-font mb-4 border-bottom border-[#333] pb-2" data-i18n="rumors.context">${t('rumors.context')}</h5>

                            <div class="mb-3">
                                <label class="form-label text-gray-400 text-sm" data-i18n="rumors.input.character">${t('rumors.input.character')}</label>
                                <input type="text" id="custom-character" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="${t('rumors.placeholder.character')}">
                            </div>

                            <div class="mb-3">
                                <label class="form-label text-gray-400 text-sm" data-i18n="rumors.input.location">${t('rumors.input.location')}</label>
                                <input type="text" id="custom-location" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="${t('rumors.placeholder.location')}">
                            </div>

                            <div class="mb-3">
                                <label class="form-label text-gray-400 text-sm" data-i18n="rumors.input.object">${t('rumors.input.object')}</label>
                                <input type="text" id="custom-object" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="${t('rumors.placeholder.object')}">
                            </div>

                            <div class="mb-4">
                                <label class="form-label text-gray-400 text-sm" data-i18n="rumors.input.creature">${t('rumors.input.creature')}</label>
                                <input type="text" id="custom-creature" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="${t('rumors.placeholder.creature')}">
                            </div>

                            <button id="btn-generate-rumor" class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2">
                                <i class="ph ph-magic-wand"></i> <span data-i18n="rumors.btn.generate">${t('rumors.btn.generate')}</span>
                            </button>
                            <button id="btn-clear-rumors" class="btn btn-outline-danger w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                                <i class="ph ph-trash"></i> <span data-i18n="rumors.btn.clear">${t('rumors.btn.clear')}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Main Area: Rumors List -->
                    <div class="flex-1 bg-[#111] p-4 overflow-y-auto custom-scrollbar relative">
                        <div id="rumors-list" class="d-flex flex-column gap-3 max-w-4xl mx-auto">
                            <!-- Empty State -->
                            <div id="empty-state" class="text-center text-gray-600 mt-5">
                                <i class="ph ph-mask-sad text-6xl mb-3 opacity-50"></i>
                                <h4 class="medieval-font" data-i18n="rumors.empty.title">${t('rumors.empty.title')}</h4>
                                <p data-i18n="rumors.empty.desc">${t('rumors.empty.desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.rumorsList = this.container.querySelector('#rumors-list');
        this.attachEvents();
    }

    attachEvents() {
        this.container.querySelector('#btn-generate-rumor').addEventListener('click', () => {
            const context = {
                character: this.container.querySelector('#custom-character').value.trim(),
                location: this.container.querySelector('#custom-location').value.trim(),
                object: this.container.querySelector('#custom-object').value.trim(),
                creature: this.container.querySelector('#custom-creature').value.trim()
            };
            this.controller.generateRumor(context);
        });

        this.container.querySelector('#btn-clear-rumors').addEventListener('click', () => {
            this.controller.clearRumors();
        });
    }

    addRumor(rumor) {
        const emptyState = this.container.querySelector('#empty-state');
        if (emptyState) emptyState.remove();

        const t = (key) => LanguageService.get(key) || key;

        const rumorCard = document.createElement('div');
        rumorCard.className = 'card bg-[#1a1a1a] border border-[#333] shadow-sm fade-in p-3';
        rumorCard.innerHTML = `
            <div class="card-body p-0">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-[#222] border border-[#444] ${rumor.truthLevel.color} px-2 py-1">
                        ${t('rumors.truth.' + rumor.truthLevel.label) || rumor.truthLevel.label}
                    </span>
                    <button class="btn btn-sm btn-link text-gray-500 hover:text-red-500 p-0 remove-rumor">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
                <p class="card-text text-gray-300 text-lg mb-0 font-serif leading-relaxed">
                    "${rumor.text}"
                </p>
            </div>
        `;

        rumorCard.querySelector('.remove-rumor').addEventListener('click', () => {
            rumorCard.remove();
            if (this.rumorsList.children.length === 0) {
                this.renderEmptyState();
            }
        });

        this.rumorsList.prepend(rumorCard);
    }

    renderEmptyState() {
        const t = (key) => LanguageService.get(key) || key;
        this.rumorsList.innerHTML = `
            <div id="empty-state" class="text-center text-gray-600 mt-5 fade-in">
                <i class="ph ph-mask-sad text-6xl mb-3 opacity-50"></i>
                <h4 class="medieval-font" data-i18n="rumors.empty.title">${t('rumors.empty.title')}</h4>
                <p data-i18n="rumors.empty.desc">${t('rumors.empty.desc')}</p>
            </div>
        `;
    }

    clearList() {
        this.renderEmptyState();
    }
}