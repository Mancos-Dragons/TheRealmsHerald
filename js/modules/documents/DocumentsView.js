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
                                    <option value="texture-custom" ${config.texture === 'texture-custom' ? 'selected' : ''} data-i18n="docs.texture.custom">Personalizada</option>
                                </select>
                            </div>

                            <div id="opts-custom-texture" class="${config.texture === 'texture-custom' ? '' : 'hidden'}">
                                <label class="${labelClass}">URL o Archivo de Textura</label>
                                <input type="text" id="inp-custom-texture" class="${inputClass} mb-1" value="${config.customTexture || ''}" placeholder="URL de imagen...">
                                <input type="file" id="inp-custom-texture-file" class="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-600 cursor-pointer" accept="image/*">
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="docs.font">${t('docs.font')}</label>
                                <select id="inp-font" class="${inputClass} cursor-pointer">
                                    <option value="font-royal" ${config.font === 'font-royal' ? 'selected' : ''} data-i18n="docs.font.royal">${t('docs.font.royal')}</option>
                                    <option value="font-script" ${config.font === 'font-script' ? 'selected' : ''} data-i18n="docs.font.script">${t('docs.font.script')}</option>
                                    <option value="font-custom" ${config.font === 'font-custom' ? 'selected' : ''} data-i18n="docs.font.custom">Personalizada</option>
                                </select>
                            </div>

                            <div id="opts-custom-font" class="${config.font === 'font-custom' ? '' : 'hidden'}">
                                <label class="${labelClass}">URL de Fuente (CSS o archivo)</label>
                                <input type="text" id="inp-custom-font" class="${inputClass}" value="${config.customFont || ''}" placeholder="URL de Google Fonts o .ttf...">
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

                            <div id="opts-custom-seal" class="${config.type === 'decree' ? '' : 'hidden'}">
                                <label class="${labelClass}">Sello de Cera (Archivo o URL)</label>
                                <input type="text" id="inp-custom-seal" class="${inputClass} mb-1" value="${config.customSeal || ''}" placeholder="Opcional. URL de imagen...">
                                <input type="file" id="inp-custom-seal-file" class="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-600 cursor-pointer" accept="image/*">
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
            customTexture: document.getElementById('inp-custom-texture')?.value || '',
            customFont: document.getElementById('inp-custom-font')?.value || '',
            customSeal: document.getElementById('inp-custom-seal')?.value || ''
        };
    }

    renderDocument(config) {
        const previewContainer = document.getElementById('document-preview');
        if (!previewContainer) return;

        // Show/hide dynamic fields
        const sealOpts = document.getElementById('opts-seal');
        const customSealOpts = document.getElementById('opts-custom-seal');
        const customTextureOpts = document.getElementById('opts-custom-texture');
        const customFontOpts = document.getElementById('opts-custom-font');

        if (sealOpts) {
            sealOpts.classList.toggle('hidden', config.type !== 'decree');
        }
        if (customSealOpts) {
            customSealOpts.classList.toggle('hidden', config.type !== 'decree');
        }
        if (customTextureOpts) {
            customTextureOpts.classList.toggle('hidden', config.texture !== 'texture-custom');
        }
        if (customFontOpts) {
            customFontOpts.classList.toggle('hidden', config.font !== 'font-custom');
        }

        previewContainer.className = `paper-page ${config.texture} ${config.font} doc-${config.type}`;

        if (config.texture === 'texture-custom' && config.customTexture) {
            previewContainer.style.backgroundImage = `url('${config.customTexture}')`;
            previewContainer.style.backgroundSize = 'cover';
        } else {
            previewContainer.style.backgroundImage = '';
            previewContainer.style.backgroundSize = '';
        }

        // Handle Custom Fonts (Dynamic Injection)
        if (config.font === 'font-custom' && config.customFont) {
            let fontId = 'custom-doc-font';
            let fontStyle = document.getElementById(fontId);
            if (!fontStyle) {
                fontStyle = document.createElement('style');
                fontStyle.id = fontId;
                document.head.appendChild(fontStyle);
            }

            if (config.customFont.includes('fonts.googleapis.com')) {
                fontStyle.innerHTML = `@import url('${config.customFont}');\n .font-custom { font-family: 'CustomFont', sans-serif; /* Fallback, specific font name handled below if possible, or relying on user config */ }`;
                // To properly use google fonts without knowing the exact family name,
                // we'll attempt to parse it safely.
                try {
                    // Ensure it has a protocol to be a valid URL for the parser
                    let urlToParse = config.customFont;
                    if (urlToParse.startsWith('//')) urlToParse = 'https:' + urlToParse;
                    else if (!urlToParse.startsWith('http')) urlToParse = 'https://' + urlToParse;

                    const urlObj = new URL(urlToParse);
                    const familyParam = urlObj.searchParams.get('family');
                    if (familyParam) {
                        const familyName = familyParam.split(':')[0].replace(/\+/g, ' ');
                        fontStyle.innerHTML += `\n.font-custom .doc-title, .font-custom .doc-body, .font-custom .doc-signature { font-family: '${familyName}', sans-serif !important; }`;
                    }
                } catch (e) {
                    console.warn("Could not parse custom font URL for family name fallback", e);
                }
            } else {
                 fontStyle.innerHTML = `
                    @font-face {
                        font-family: 'UserCustomFont';
                        src: url('${config.customFont}');
                    }
                    .font-custom .doc-title, .font-custom .doc-body, .font-custom .doc-signature {
                        font-family: 'UserCustomFont', sans-serif !important;
                    }
                `;
            }
        } else {
             const fontStyle = document.getElementById('custom-doc-font');
             if (fontStyle) fontStyle.remove();
        }

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
        const safeCustomSeal = config.customSeal ? escapeHTML(config.customSeal) : '';

        let content = '';
        if (config.type === 'decree') {
            let sealContent = safeSeal;
            if (config.customSeal) {
                // If custom seal is provided, use it as background image for the seal container
                sealContent = ''; // Empty out icon
            } else if (safeSeal.startsWith('ph-')) {
                sealContent = `<i class="ph ${safeSeal}"></i>`;
            }

            content = `
                <div class="doc-decree-inner">
                    <div class="doc-seal" ${config.customSeal ? `style="background-image: url('${safeCustomSeal}'); background-size: cover; background-position: center;"` : ''}>${sealContent}</div>
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
        this.autoFitText(previewContainer);
    }

    autoFitText(container) {
        // Find inner wrappers to check scroll height
        const inner = container.querySelector('.doc-decree-inner, .doc-letter-inner');
        if (!inner) return;

        // Reset scale first
        container.style.setProperty('--doc-scale', '1');

        // Use a slight timeout to let DOM updates reflect actual sizes
        setTimeout(() => {
            let scale = 1.0;
            const minScale = 0.4; // Don't shrink below 40%

            // While the content overflows its container, shrink the text
            // The inner element is what imposes height boundaries
            while ((inner.scrollHeight > inner.clientHeight || inner.offsetHeight > inner.clientHeight) && scale > minScale) {
                scale -= 0.05;
                container.style.setProperty('--doc-scale', scale.toFixed(2));
            }
        }, 10);
    }
}