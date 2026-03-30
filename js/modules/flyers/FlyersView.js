import { LanguageService } from '../../core/LanguageService.js';

export default class FlyersView {
    constructor(container) {
        this.container = container;
    }

    renderWorkspace(config) {
        config = config || { texture: 'texture-clean', filter: 'none' };
        const t = (key) => LanguageService.get(key);
        const baseInputClass = "w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 focus:border-amber-500 outline-none font-sans text-sm";
        const inputClass = `${baseInputClass} rounded`;
        const labelClass = "block text-xs text-amber-500 font-bold uppercase tracking-wider mb-1 mt-4";
        const btnClass = "w-full p-2 mt-4 rounded bg-amber-700 hover:bg-amber-600 text-white font-bold transition flex flex-col items-center gap-1 text-sm shadow-lg";
        const btnSecClass = "w-full p-2 mt-2 rounded bg-[#333] hover:bg-[#444] text-white font-bold transition flex flex-col items-center gap-1 text-sm shadow-lg";

        this.container.innerHTML = `
            <div class="flex w-full h-full bg-[#0d0d0d] overflow-hidden fade-in font-sans" id="flyers-container-root">
                <aside class="w-80 bg-[#111] border-r border-[#222] flex flex-col z-20 shadow-2xl shrink-0">
                    <div class="p-4 border-b border-[#222] bg-[#161616]">
                        <h2 class="text-amber-600 font-bold medieval-font text-2xl truncate">
                            <i class="ph ph-megaphone align-middle me-2"></i><span data-i18n="flyers.title">${t('flyers.title') || 'Pregonero Visual'}</span>
                        </h2>
                        <p class="text-xs text-gray-500 uppercase tracking-widest" data-i18n="flyers.subtitle">${t('flyers.subtitle') || 'Editor de Flyers'}</p>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar p-5">
                        <form id="flyers-editor-form" class="space-y-2">
                            <div>
                                <label class="${labelClass}" data-i18n="flyers.texture">${t('flyers.texture') || 'Textura del Papel'}</label>
                                <select id="flyer-texture" class="${inputClass} cursor-pointer">
                                    <option value="texture-clean" ${config.texture === 'texture-clean' ? 'selected' : ''} data-i18n="flyers.textureClean">${t('flyers.textureClean') || 'Pergamino Limpio'}</option>
                                    <option value="texture-gritty" ${config.texture === 'texture-gritty' ? 'selected' : ''} data-i18n="flyers.textureGritty">${t('flyers.textureGritty') || 'Panfleto Sucio'}</option>
                                    <option value="texture-magic" ${config.texture === 'texture-magic' ? 'selected' : ''} data-i18n="flyers.textureMagic">${t('flyers.textureMagic') || 'Papel Arcano'}</option>
                                </select>
                            </div>

                            <div>
                                <label class="${labelClass}" data-i18n="flyers.filter">${t('flyers.filter') || 'Filtro de Desgaste'}</label>
                                <select id="flyer-filter" class="${inputClass} cursor-pointer">
                                    <option value="none" ${config.filter === 'none' ? 'selected' : ''} data-i18n="flyers.filterNone">${t('flyers.filterNone') || 'Ninguno'}</option>
                                    <option value="sepia" ${config.filter === 'sepia' ? 'selected' : ''} data-i18n="flyers.filterSepia">${t('flyers.filterSepia') || 'Sepia Viejo'}</option>
                                    <option value="grayscale" ${config.filter === 'grayscale' ? 'selected' : ''} data-i18n="flyers.filterGrayscale">${t('flyers.filterGrayscale') || 'Blanco y Negro'}</option>
                                    <option value="blood" ${config.filter === 'blood' ? 'selected' : ''} data-i18n="flyers.filterBlood">${t('flyers.filterBlood') || 'Manchas Rojas'}</option>
                                </select>
                            </div>

                            <hr class="border-[#333] my-4">

                            <div>
                                <label class="${labelClass}" data-i18n="flyers.addText">${t('flyers.addText') || 'Añadir Texto'}</label>
                                <textarea id="flyer-new-text" rows="3" class="${inputClass}" placeholder="${t('flyers.addTextPlaceholder') || 'Ej: SE BUSCA: Recompensa 500 po'}" data-i18n="flyers.addTextPlaceholder"></textarea>
                                <button type="button" id="btn-add-text" class="${btnSecClass} mt-2">
                                    <i class="ph ph-text-t"></i> <span data-i18n="flyers.addText">${t('flyers.addText') || 'Añadir Texto'}</span>
                                </button>
                            </div>

                            <hr class="border-[#333] my-4">

                            <div>
                                <label class="${labelClass}" data-i18n="flyers.addImage">${t('flyers.addImage') || 'Añadir Imagen'}</label>
                                <input type="text" id="flyer-img-url" class="${inputClass} mb-2" placeholder="${t('flyers.addImagePlaceholder') || 'URL de la imagen...'}" data-i18n="flyers.addImagePlaceholder">
                                <input type="file" id="flyer-img-file" class="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-600 cursor-pointer" accept="image/*">
                                <button type="button" id="btn-add-img" class="${btnSecClass} mt-2">
                                    <i class="ph ph-image"></i> <span data-i18n="flyers.addImage">${t('flyers.addImage') || 'Añadir Imagen'}</span>
                                </button>
                            </div>

                            <button type="button" id="btn-export-pdf" class="${btnClass} mt-8">
                                <i class="ph ph-file-pdf text-lg"></i> <span data-i18n="flyers.exportPdf">${t('flyers.exportPdf') || 'Exportar PDF'}</span>
                            </button>
                        </form>
                    </div>
                </aside>

                <main class="flex-1 bg-[#18181b] overflow-hidden relative flex flex-col">
                    <div class="h-12 bg-[#222] border-b border-[#333] flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
                        <div class="text-gray-500 text-xs uppercase tracking-widest font-mono" data-i18n="flyers.preview">${t('flyers.preview') || 'Vista Previa - Drag & Drop'}</div>
                    </div>
                    <div class="flex-1 overflow-auto flex justify-center p-10 bg-[url('assets/img/dark-wood.png')] bg-repeat relative">
                        <!-- Canvas container must have definite dimensions for PDF export like documents -->
                        <div id="flyer-canvas-container" class="flyer-page shadow-2xl relative overflow-hidden bg-white">
                            <div id="flyer-canvas-bg" class="absolute inset-0 w-full h-full z-0 pointer-events-none"></div>
                            <div id="flyer-canvas" class="relative w-full h-full z-10">
                                <!-- Canvas Elements go here -->
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;

        LanguageService.translateDOM(this.container);
    }

    renderCanvas(model) {
        const bgLayer = document.getElementById('flyer-canvas-bg');
        const canvas = document.getElementById('flyer-canvas');
        if (!bgLayer || !canvas) return;

        // Apply config
        bgLayer.className = `absolute inset-0 w-full h-full z-0 pointer-events-none ${model.config.texture}`;

        let filterClass = '';
        if (model.config.filter === 'sepia') filterClass = 'sepia-[.8] contrast-125';
        if (model.config.filter === 'grayscale') filterClass = 'grayscale contrast-150';
        if (model.config.filter === 'blood') filterClass = 'brightness-90 sepia-[.4] hue-rotate-[320deg] saturate-[3]';

        canvas.className = `relative w-full h-full z-10 ${filterClass}`;

        // Render elements
        canvas.innerHTML = '';
        model.elements.forEach(el => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flyer-element absolute cursor-move group border border-transparent hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors duration-100 p-1 select-none touch-none inline-block';
            wrapper.style.left = `${el.x}px`;
            wrapper.style.top = `${el.y}px`;
            wrapper.dataset.id = el.id;

            // Delete button
            const delBtn = document.createElement('button');
            delBtn.className = 'absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md hover:bg-red-500 pointer-events-auto btn-del';
            delBtn.innerHTML = '<i class="ph ph-x text-xs font-bold pointer-events-none"></i>';
            delBtn.onclick = (e) => {
                e.stopPropagation(); // prevent dragging
                // Fire custom event to be handled by controller
                canvas.dispatchEvent(new CustomEvent('remove-flyer-element', { detail: { id: el.id } }));
            };
            wrapper.appendChild(delBtn);

            // Size cycle button
            const sizeBtn = document.createElement('button');
            sizeBtn.className = 'absolute -bottom-3 -right-3 bg-[#222] text-amber-500 rounded-full w-auto px-2 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md hover:bg-[#333] hover:text-amber-400 pointer-events-auto text-xs font-bold font-sans border border-amber-600/30 whitespace-nowrap btn-size';

            // Map of widths for toggling
            const widths = [
                { class: 'w-1/4', label: '25%', fontClass: 'text-2xl' },
                { class: 'w-1/2', label: '50%', fontClass: 'text-4xl' },
                { class: 'w-3/4', label: '75%', fontClass: 'text-6xl' },
                { class: 'w-full', label: '100%', fontClass: 'text-7xl' }
            ];

            const currentWidthClass = el.widthClass || 'w-1/2';
            const currentIndex = widths.findIndex(w => w.class === currentWidthClass) !== -1 ? widths.findIndex(w => w.class === currentWidthClass) : 1;
            const nextIndex = (currentIndex + 1) % widths.length;

            sizeBtn.innerHTML = `<i class="ph ph-arrows-out-line mr-1 pointer-events-none"></i> <span class="pointer-events-none">${widths[currentIndex].label}</span>`;
            sizeBtn.onclick = (e) => {
                e.stopPropagation(); // prevent dragging
                canvas.dispatchEvent(new CustomEvent('resize-flyer-element', { detail: { id: el.id, widthClass: widths[nextIndex].class } }));
            };
            wrapper.appendChild(sizeBtn);

            // Container for scalable content
            const contentContainer = document.createElement('div');
            // Tailwind width class directly applied to content container
            contentContainer.className = `pointer-events-none ${currentWidthClass}`;

            // We need wrapper to stretch based on content. But if content is percentage based, percentage of what?
            // The canvas is the relative parent. So the wrapper needs the width class, or wrapper needs width: currentWidthClass.
            // Wait, wrapper is position absolute. If wrapper gets w-1/4, it will be 25% of canvas width.
            wrapper.classList.add(currentWidthClass);
            contentContainer.className = 'pointer-events-none w-full';

            if (el.type === 'text') {
                const textDiv = document.createElement('div');
                // Use the mapped font class for scaling the text size automatically
                textDiv.className = `medieval-font text-black leading-tight whitespace-pre-wrap w-full break-words ${widths[currentIndex].fontClass}`;
                textDiv.style.textShadow = '0 1px 1px rgba(255,255,255,0.5)';
                textDiv.innerHTML = this.escapeHTML(el.content).replace(/\n/g, '<br>');
                contentContainer.appendChild(textDiv);
            } else if (el.type === 'image') {
                const img = document.createElement('img');
                img.src = el.src;
                img.className = 'w-full h-auto object-contain mix-blend-multiply';
                contentContainer.appendChild(img);
            }

            wrapper.appendChild(contentContainer);
            canvas.appendChild(wrapper);
        });
    }

    escapeHTML(str) {
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

    getFormValues() {
        return {
            texture: document.getElementById('flyer-texture')?.value || 'texture-clean',
            filter: document.getElementById('flyer-filter')?.value || 'none'
        };
    }
}
