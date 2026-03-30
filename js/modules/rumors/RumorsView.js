import { LanguageService } from '../../core/LanguageService.js';

import { AIService } from '../../services/AIService.js';

const BOLD_REGEX = /\*(.*?)\*/g;
const BR_REGEX = /\n/g;

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default class RumorsView {
    constructor(container) {
        this.container = container;
    }

    render(model) {
        const t = (key) => LanguageService.get(key);
        const aiBadge = AIService.isConfigured()
            ? `<span class="badge bg-success ms-2" style="font-size: 0.6em; vertical-align: middle;"><i class="ph ph-robot"></i> AI</span>`
            : '';

        const html = `
            <div class="container py-4 fade-in">
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <i class="ph ph-mask-happy text-5xl text-amber-500 mb-2"></i>
                        <h2 class="medieval-font text-amber-500"><span data-i18n="rumors.title">${t('rumors.title')}</span>${aiBadge}</h2>
                        <p class="text-gray-400" data-i18n="rumors.desc">${t('rumors.desc')}</p>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">
                        <div class="card bg-[#161616] border border-[#333] shadow-lg mb-4">
                            <div class="card-body p-4">
                                <h5 class="card-title text-gray-200 mb-3"><i class="ph ph-sliders"></i> <span data-i18n="rumors.variables">${t('rumors.variables')}</span></h5>

                                <div class="mb-3">
                                    <label class="form-label text-gray-400 small" data-i18n="rumors.town">${t('rumors.town')}</label>
                                    <input type="text" id="input-town-name" class="form-control bg-[#0d0d0d] text-gray-200 border-secondary" placeholder="${t('rumors.town.placeholder')}" data-i18n="rumors.town.placeholder">
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-gray-400 small" data-i18n="rumors.npc">${t('rumors.npc')}</label>
                                        <input type="text" id="input-npc-name" class="form-control bg-[#0d0d0d] text-gray-200 border-secondary" placeholder="${t('rumors.npc.placeholder')}" data-i18n="rumors.npc.placeholder">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-gray-400 small" data-i18n="rumors.role">${t('rumors.role')}</label>
                                        <input type="text" id="input-npc-role" class="form-control bg-[#0d0d0d] text-gray-200 border-secondary" placeholder="${t('rumors.role.placeholder')}" data-i18n="rumors.role.placeholder">
                                    </div>
                                </div>

                                <button id="btn-generate-rumor" class="btn btn-warning w-100 mt-2">
                                    <i class="ph ph-sparkle" id="btn-generate-icon"></i> <span id="btn-generate-text" data-i18n="rumors.generate">${t('rumors.generate')}</span>
                                </button>
                            </div>
                        </div>

                        <div id="rumor-result-container" class="card bg-[#161616] border border-[#333] shadow-lg d-none">
                            <div class="card-body p-4">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="ph ph-ear text-amber-500 text-2xl me-2"></i>
                                    <h5 class="card-title text-gray-200 m-0" data-i18n="rumors.result.title">${t('rumors.result.title')}</h5>
                                </div>
                                <div class="bg-[#0d0d0d] p-3 rounded border border-secondary mb-4">
                                    <p id="output-rumor-text" class="text-gray-300 m-0 fst-italic">...</p>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <i class="ph ph-notebook text-info text-2xl me-2"></i>
                                    <h5 class="card-title text-gray-200 m-0" data-i18n="rumors.result.hook">${t('rumors.result.hook')}</h5>
                                </div>
                                <div class="bg-[#0d0d0d] p-3 rounded border border-secondary">
                                    <p id="output-rumor-hook" class="text-gray-300 m-0 small">...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        LanguageService.translateDOM();
    }

    updateResult({ rumor, hook }) {
        const container = this.container.querySelector('#rumor-result-container');
        const rumorTextEl = this.container.querySelector('#output-rumor-text');
        const hookTextEl = this.container.querySelector('#output-rumor-hook');

        if (container && rumorTextEl && hookTextEl) {
            const formatText = (text) => escapeHTML(text).replace(BOLD_REGEX, '<strong>$1</strong>').replace(BR_REGEX, '<br>');
            rumorTextEl.innerHTML = formatText(rumor);
            hookTextEl.innerHTML = formatText(hook);
            container.classList.remove('d-none');
        }
    }

    setLoading(isLoading) {
        const btn = this.container.querySelector('#btn-generate-rumor');
        const icon = this.container.querySelector('#btn-generate-icon');
        const text = this.container.querySelector('#btn-generate-text');

        if (btn && icon && text) {
            if (isLoading) {
                btn.disabled = true;
                icon.className = 'spinner-border spinner-border-sm';
                text.textContent = LanguageService.get('rumors.generating');
            } else {
                btn.disabled = false;
                icon.className = 'ph ph-sparkle';
                text.textContent = LanguageService.get('rumors.generate');
            }
        }
    }
}