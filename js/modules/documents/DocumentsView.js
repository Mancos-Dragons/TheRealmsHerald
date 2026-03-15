import { LanguageService } from '../../core/LanguageService.js';

export default class DocumentsView {
    constructor(container) {
        this.container = container;
    }

    renderWorkspace(config) {
        const t = (key) => LanguageService.get(key);
        const baseInputClass = "w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 focus:border-amber-500 outline-none font-sans text-sm";
        const inputClass = `${baseInputClass} rounded`;
        const labelClass = "block text-xs text-amber-500 font-bold uppercase tracking-wider mb-1 mt-4";
        const btnClass = "w-full p-2 mt-4 rounded bg-amber-700 hover:bg-amber-600 text-white font-bold transition flex flex-col items-center gap-1 text-sm shadow-lg";

        this.container.innerHTML = `
            <div class="flex w-full h-full bg-[#0d0d0d] overflow-hidden fade-in font-sans">

                <aside class="w-80 bg-[#111] border-r border-[#222] flex flex-col z-20 shadow-2xl shrink-0">
                    <div class="p-4 border-b border-[#222] bg-[#161616]">
                        <h2 class="text-amber-600 font-bold medieval-font text-2xl truncate">
                            <i class="ph ph-scroll align-middle me-2"></i>Escriba Real
                        </h2>
                        <p class="text-xs text-gray-500 uppercase tracking-widest" data-i18n="docs.editor.title">${t('docs.editor.title')}</p>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar p-5">
                        <form id="docs-editor-form" class="space-y-2">
                            <div>
                                <label class="${labelClass}" data-i18n="docs.type">${t('docs.type')}</label>
                                <select id="inp-type" class="${inputClass} cursor-pointer">
                                    <option value="decree" ${config.type === 'decree' ? 'selected' : ''} data-i18n="docs.type.decree">${t('docs.type.decree')}</option>
                                    <option value="letter" ${config.type === 'letter' ? 'selected' : ''} data-i18n="docs.type.letter">${t('docs.type.letter')}</option>
                                </select>
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="docs.texture">${t('docs.texture')}</label>
                                <select id="inp-texture" class="${inputClass} cursor-pointer">
                                    <option value="texture-clean" ${config.texture === 'texture-clean' ? 'selected' : ''} data-i18n="docs.texture.clean">${t('docs.texture.clean')}</option>
                                    <option value="texture-gritty" ${config.texture === 'texture-gritty' ? 'selected' : ''} data-i18n="docs.texture.gritty">${t('docs.texture.gritty')}</option>
                                </select>
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="docs.font">${t('docs.font')}</label>
                                <select id="inp-font" class="${inputClass} cursor-pointer">
                                    <option value="font-royal" ${config.font === 'font-royal' ? 'selected' : ''} data-i18n="docs.font.royal">${t('docs.font.royal')}</option>
                                    <option value="font-script" ${config.font === 'font-script' ? 'selected' : ''} data-i18n="docs.font.script">${t('docs.font.script')}</option>
                                </select>
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="docs.title">${t('docs.title')}</label>
                                <input type="text" id="inp-title" class="${inputClass}" value="${config.title || ''}">
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="docs.body">${t('docs.body')}</label>
                                <textarea id="inp-body" rows="6" class="${inputClass} leading-relaxed">${config.body || ''}</textarea>
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="docs.signature">${t('docs.signature')}</label>
                                <input type="text" id="inp-signature" class="${inputClass}" value="${config.signature || ''}">
                            </div>

                            <div id="opts-seal" class="${config.type === 'decree' ? '' : 'hidden'}">
                                <label class="${labelClass}" data-i18n="docs.seal">${t('docs.seal')}</label>
                                <input type="text" id="inp-seal" class="${inputClass}" value="${config.seal || ''}" placeholder="Ej: ph-crown">
                            </div>

                            <button type="button" id="btn-export-pdf" class="${btnClass}">
                                <i class="ph ph-file-pdf text-lg"></i> <span data-i18n="docs.btn.pdf">${t('docs.btn.pdf')}</span>
                            </button>
                        </form>
                    </div>
                </aside>

                <main class="flex-1 bg-[#18181b] overflow-hidden relative flex flex-col">
                    <div class="h-12 bg-[#222] border-b border-[#333] flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
                        <div class="text-gray-500 text-xs uppercase tracking-widest font-mono">Vista Previa</div>
                    </div>
                    <div class="flex-1 overflow-auto flex justify-center p-10 bg-[url('assets/img/dark-wood.png')] bg-repeat">
                        <div id="document-preview" class="transition-transform duration-200 ease-out origin-top shadow-2xl">
                            <!-- Live Preview Here -->
                        </div>
                    </div>
                </main>
            </div>
        `;
    }

    getFormValues() {
        return {
            type: document.getElementById('inp-type')?.value || 'decree',
            title: document.getElementById('inp-title')?.value || '',
            body: document.getElementById('inp-body')?.value || '',
            signature: document.getElementById('inp-signature')?.value || '',
            seal: document.getElementById('inp-seal')?.value || 'ph-crown',
            texture: document.getElementById('inp-texture')?.value || 'texture-clean',
            font: document.getElementById('inp-font')?.value || 'font-royal',
        };
    }

    renderDocument(config) {
        const previewContainer = document.getElementById('document-preview');
        if (!previewContainer) return;

        // Show/hide seal field based on type
        const sealOpts = document.getElementById('opts-seal');
        if (sealOpts) {
            if (config.type === 'decree') {
                sealOpts.classList.remove('hidden');
            } else {
                sealOpts.classList.add('hidden');
            }
        }

        previewContainer.className = `paper-page ${config.texture} ${config.font} doc-${config.type}`;

        const escapeHTML = (str) => {
            return str.replace(/[&<>'"]/g,
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag)
            );
        };

        const safeBody = config.body ? escapeHTML(config.body).replace(/\n/g, '<br>') : '';
        const safeTitle = config.title ? escapeHTML(config.title) : '';
        const safeSignature = config.signature ? escapeHTML(config.signature) : '';
        const safeSeal = config.seal ? escapeHTML(config.seal) : '';

        let content = '';
        if (config.type === 'decree') {
            let sealContent = safeSeal;
            if (safeSeal.startsWith('ph-')) {
                sealContent = `<i class="ph ${safeSeal}"></i>`;
            }

            content = `
                <div class="doc-decree-inner">
                    <div class="doc-seal">${sealContent}</div>
                    <h1 class="doc-title">${safeTitle}</h1>
                    <div class="doc-body">${safeBody}</div>
                    ${safeSignature ? `<div class="doc-signature">Fdo: ${safeSignature}</div>` : ''}
                </div>
            `;
        } else if (config.type === 'letter') {
            content = `
                <div class="doc-letter-inner">
                    ${safeTitle ? `<h1 class="doc-title">${safeTitle}</h1>` : ''}
                    <div class="doc-body">${safeBody}</div>
                    ${safeSignature ? `<div class="doc-signature">${safeSignature}</div>` : ''}
                </div>
            `;
        }

        previewContainer.innerHTML = content;
    }
}