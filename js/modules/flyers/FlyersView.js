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
            <div class="flex w-full h-full bg-[#0d0d0d] overflow-hidden fade-in font-sans">
                <aside class="w-80 bg-[#111] border-r border-[#222] flex flex-col z-20 shadow-2xl shrink-0">
                    <div class="p-4 border-b border-[#222] bg-[#161616]">
                        <h2 class="text-amber-600 font-bold medieval-font text-2xl truncate">
                            <i class="ph ph-megaphone align-middle me-2"></i>Pregonero Visual
                        </h2>
                        <p class="text-xs text-gray-500 uppercase tracking-widest">Editor de Flyers</p>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar p-5">
                        <form id="flyers-editor-form" class="space-y-2">
                            <div>
                                <label class="${labelClass}">Textura del Papel</label>
                                <select id="flyer-texture" class="${inputClass} cursor-pointer">
                                    <option value="texture-clean" ${config.texture === 'texture-clean' ? 'selected' : ''}>Pergamino Limpio</option>
                                    <option value="texture-gritty" ${config.texture === 'texture-gritty' ? 'selected' : ''}>Panfleto Sucio</option>
                                    <option value="texture-magic" ${config.texture === 'texture-magic' ? 'selected' : ''}>Papel Arcano</option>
                                </select>
                            </div>

                            <div>
                                <label class="${labelClass}">Filtro de Desgaste</label>
                                <select id="flyer-filter" class="${inputClass} cursor-pointer">
                                    <option value="none" ${config.filter === 'none' ? 'selected' : ''}>Ninguno</option>
                                    <option value="sepia" ${config.filter === 'sepia' ? 'selected' : ''}>Sepia Viejo</option>
                                    <option value="grayscale" ${config.filter === 'grayscale' ? 'selected' : ''}>Blanco y Negro</option>
                                    <option value="blood" ${config.filter === 'blood' ? 'selected' : ''}>Manchas Rojas</option>
                                </select>
                            </div>

                            <hr class="border-[#333] my-4">

                            <div>
                                <label class="${labelClass}">Añadir Texto</label>
                                <textarea id="flyer-new-text" rows="3" class="${inputClass}" placeholder="Ej: SE BUSCA: Recompensa 500 po"></textarea>
                                <button type="button" id="btn-add-text" class="${btnSecClass} mt-2">
                                    <i class="ph ph-text-t"></i> Añadir Texto
                                </button>
                            </div>

                            <hr class="border-[#333] my-4">

                            <div>
                                <label class="${labelClass}">Añadir Imagen</label>
                                <input type="text" id="flyer-img-url" class="${inputClass} mb-2" placeholder="URL de la imagen...">
                                <input type="file" id="flyer-img-file" class="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-600 cursor-pointer" accept="image/*">
                                <button type="button" id="btn-add-img" class="${btnSecClass} mt-2">
                                    <i class="ph ph-image"></i> Añadir Imagen
                                </button>
                            </div>

                            <button type="button" id="btn-export-pdf" class="${btnClass} mt-8">
                                <i class="ph ph-file-pdf text-lg"></i> <span>Exportar PDF</span>
                            </button>
                        </form>
                    </div>
                </aside>

                <main class="flex-1 bg-[#18181b] overflow-hidden relative flex flex-col">
                    <div class="h-12 bg-[#222] border-b border-[#333] flex items-center justify-between px-4 shrink-0 z-10 shadow-md">
                        <div class="text-gray-500 text-xs uppercase tracking-widest font-mono">Vista Previa - Drag & Drop</div>
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
            delBtn.className = 'absolute -top-3 -right-3 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md hover:bg-red-500 pointer-events-auto';
            delBtn.innerHTML = '<i class="ph ph-x text-xs font-bold"></i>';
            delBtn.onclick = (e) => {
                e.stopPropagation(); // prevent dragging
                // Fire custom event to be handled by controller
                canvas.dispatchEvent(new CustomEvent('remove-flyer-element', { detail: { id: el.id } }));
            };
            wrapper.appendChild(delBtn);

            // Container for scalable content
            const contentContainer = document.createElement('div');
            contentContainer.className = 'pointer-events-none';

            if (el.type === 'text') {
                const textDiv = document.createElement('div');
                textDiv.className = 'medieval-font text-2xl text-black leading-tight whitespace-pre-wrap';
                textDiv.style.textShadow = '0 1px 1px rgba(255,255,255,0.5)';
                textDiv.innerHTML = this.escapeHTML(el.content).replace(/\n/g, '<br>');
                contentContainer.appendChild(textDiv);
            } else if (el.type === 'image') {
                const img = document.createElement('img');
                img.src = el.src;
                img.className = 'max-w-[250px] max-h-[250px] object-contain mix-blend-multiply'; // mix-blend makes white transparent on texture
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
