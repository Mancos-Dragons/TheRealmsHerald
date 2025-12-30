import NewspaperModel from './NewspaperModel.js';

export default class NewspaperController {
    constructor(container) {
        this.container = container;
        this.model = new NewspaperModel();
        
        this.editingId = null;
        this.draggedItem = null;
        this.draggedFromPage = null;
        this.zoomLevel = 0.9;
    }

    async init() {
        this.loadStyles();
        await this.model.load();
        
        this.renderLayout();
        this.renderPaper();
        this.attachEvents();
        
        console.log("📰 Prensa: Tinta preparada.");
    }

    loadStyles() {
        if (!document.getElementById('newspaper-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './css/modules/newspaper.css';
            link.id = 'newspaper-css';
            document.head.appendChild(link);
        }
    }

    /**
     * Renderiza el esqueleto de la aplicación (Panel Izquierdo + Área de Trabajo)
     */
    renderLayout() {
        this.container.innerHTML = `
            <div class="flex w-full h-full bg-[#111] overflow-hidden fade-in font-sans">
                
                <!-- 1. PANEL DE CONTROL (IZQUIERDA) -->
                <aside class="w-96 bg-[#0a0a0a] border-r border-[#222] flex flex-col z-20 shadow-2xl shrink-0">
                    
                    <!-- Header del Panel -->
                    <div class="p-5 border-b border-[#222] bg-[url('assets/img/noise.png')]">
                        <h2 class="text-amber-600 font-bold medieval-font text-2xl flex items-center gap-2 drop-shadow-md">
                            <i class="ph ph-pen-nib-straight"></i> Editor Real
                        </h2>
                        <p class="text-xs text-gray-500 mt-1 uppercase tracking-widest">Gaceta Oficial del Reino</p>
                    </div>

                    <!-- Scrollable Area -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                        
                        <!-- Formulario -->
                        <form id="editor-form" class="space-y-4">
                            <input type="hidden" id="edit-id">
                            
                            <!-- Título -->
                            <div class="space-y-1">
                                <label class="text-xs text-amber-500 font-bold uppercase tracking-wider">Titular</label>
                                <input type="text" id="inp-title" class="w-full fantasy-input p-3 rounded" placeholder="Ej: Avistamiento de Dragón..." required>
                            </div>

                            <!-- Metadatos (Grid) -->
                            <div class="grid grid-cols-2 gap-3">
                                <div class="space-y-1">
                                    <label class="text-xs text-amber-500 font-bold uppercase tracking-wider">Página</label>
                                    <select id="inp-page" class="w-full fantasy-input p-2 rounded cursor-pointer">
                                        <option value="1">I - Portada</option>
                                        <option value="2">II - Política</option>
                                        <option value="3">III - Sucesos</option>
                                        <option value="4">IV - Contra</option>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-xs text-gray-500 font-bold uppercase tracking-wider">Imagen (URL)</label>
                                    <input type="text" id="inp-img" class="w-full fantasy-input p-2 rounded text-xs" placeholder="https://...">
                                </div>
                            </div>

                            <!-- Cuerpo -->
                            <div class="space-y-1">
                                <label class="text-xs text-amber-500 font-bold uppercase tracking-wider">Crónica</label>
                                <textarea id="inp-body" rows="8" class="w-full fantasy-input p-3 rounded leading-relaxed" placeholder="Escribe aquí los hechos... Usa *texto* para negritas."></textarea>
                                <div class="text-[10px] text-gray-600 flex justify-between">
                                    <span>*negrita*</span>
                                    <span>Soporta HTML</span>
                                </div>
                            </div>

                            <!-- Botones Acción -->
                            <div class="flex gap-2 pt-2">
                                <button type="submit" id="btn-submit" class="flex-1 fantasy-btn-primary text-white py-3 rounded font-bold uppercase tracking-wide transition-all transform active:scale-95">
                                    <i class="ph ph-plus-circle mr-1"></i> Publicar
                                </button>
                                <button type="button" id="btn-cancel" class="hidden px-4 border border-red-900/50 text-red-400 bg-red-900/10 hover:bg-red-900/30 rounded transition">
                                    <i class="ph ph-x"></i>
                                </button>
                            </div>
                        </form>
                        
                        <div class="w-full h-px bg-[#222]"></div>

                        <!-- Configuración Rápida -->
                        <div class="bg-[#111] p-4 rounded border border-[#222]">
                            <h3 class="text-xs font-bold text-gray-400 mb-3 uppercase flex items-center gap-2">
                                <i class="ph ph-gear"></i> Ajustes de Cabecera
                            </h3>
                            <div class="space-y-3">
                                <input type="text" id="cfg-name" class="w-full fantasy-input p-2 rounded text-sm text-center font-serif text-amber-100/80" value="${this.model.config.name}">
                                <div class="flex gap-2">
                                     <input type="text" id="cfg-year" class="w-1/3 fantasy-input p-1 rounded text-xs text-center" value="${this.model.config.year}">
                                     <input type="text" id="cfg-subtitle" class="w-2/3 fantasy-input p-1 rounded text-xs" value="${this.model.config.subtitle}">
                                </div>
                                <button id="btn-update-cfg" class="w-full border border-gray-700 hover:border-amber-700 text-gray-400 hover:text-amber-500 text-xs py-1 rounded transition">Actualizar Papel</button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer del Panel -->
                    <div class="p-4 border-t border-[#222] bg-[#0d0d0d]">
                         <button id="btn-export-pdf" class="w-full bg-[#e5e5e5] hover:bg-white text-black font-bold py-3 rounded shadow-lg flex items-center justify-center gap-2 transition-colors">
                            <i class="ph ph-printer text-lg"></i> Imprimir Edición
                         </button>
                    </div>
                </aside>

                <!-- 2. ÁREA DE TRABAJO (CENTRO) -->
                <main class="flex-1 bg-[#18181b] overflow-hidden relative flex flex-col">
                    <!-- Barra de herramientas superior -->
                    <div class="h-12 bg-[#222] border-b border-[#333] flex items-center justify-between px-4 shrink-0 z-10">
                        <div class="text-gray-500 text-xs uppercase tracking-widest">Mesa de Trabajo</div>
                        <div class="flex items-center gap-2">
                            <button id="zoom-out" class="p-1 text-gray-400 hover:text-white"><i class="ph ph-minus"></i></button>
                            <span class="text-xs text-gray-400 w-12 text-center" id="zoom-display">90%</span>
                            <button id="zoom-in" class="p-1 text-gray-400 hover:text-white"><i class="ph ph-plus"></i></button>
                        </div>
                    </div>

                    <!-- Canvas Scrollable -->
                    <div class="flex-1 overflow-auto flex justify-center p-10 bg-[url('assets/img/dark-wood.png')] bg-repeat" id="preview-scroll-area">
                        <div id="paper-capture" class="transition-transform duration-200 ease-out shadow-2xl">
                            <!-- Las páginas se inyectan aquí -->
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        this.updateZoom();
    }

    /**
     * Genera el HTML visual del periódico
     */
    renderPaper() {
        const container = document.getElementById('paper-capture');
        if(!container) return;
        
        container.innerHTML = '';
        const { config } = this.model;

        [1, 2, 3, 4].forEach(pageNum => {
            const pageEl = document.createElement('div');
            pageEl.className = 'paper-page'; 
            pageEl.dataset.page = pageNum;

            let headerHTML = '';
            if (pageNum === 1) {
                headerHTML = `
                    <header class="newspaper-header">
                        <h1 class="newspaper-name">${config.name}</h1>
                        <div class="newspaper-meta">
                            <span>${config.price}</span>
                            <span>${config.subtitle}</span>
                            <span>${config.year}</span>
                        </div>
                    </header>`;
            } else {
                headerHTML = `
                    <div class="newspaper-meta mb-4 opacity-70">
                        <span>Página ${pageNum}</span>
                        <span>${config.name} • ${config.year}</span>
                    </div>`;
            }

            pageEl.innerHTML = `
                ${headerHTML}
                <div class="columns-container" id="page-${pageNum}-cols"></div>
            `;

            const items = this.model.getItems(pageNum);
            const cols = pageEl.querySelector('.columns-container');
            
            items.forEach(item => {
                cols.appendChild(this.createItemElement(item));
            });

            this.setupPageDragEvents(pageEl);

            container.appendChild(pageEl);
        });
    }

    createItemElement(item) {
        const article = document.createElement('article');
        article.className = 'news-item';
        article.draggable = true;
        article.dataset.id = item.id;
        
        let imgHtml = '';
        if (item.image) {
            imgHtml = `<img src="${item.image}" class="news-img" alt="Imagen de la noticia">`;
        }

        let bodyText = item.body
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        article.innerHTML = `
            <h3 class="headline">${item.title}</h3>
            ${imgHtml}
            <div class="news-body">${bodyText}</div>
        `;

        article.addEventListener('click', (e) => { e.stopPropagation(); this.loadToEdit(item); });
        article.addEventListener('dragstart', (e) => this.handleDragStart(e, item));
        article.addEventListener('dragend', (e) => this.handleDragEnd(e));

        return article;
    }


    attachEvents() {
        document.getElementById('editor-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        document.getElementById('btn-cancel').addEventListener('click', () => this.resetForm());

        document.getElementById('btn-update-cfg').addEventListener('click', () => {
            const name = document.getElementById('cfg-name').value;
            const year = document.getElementById('cfg-year').value;
            const subtitle = document.getElementById('cfg-subtitle').value;
            this.model.setConfig({ name, year, subtitle });
            this.renderPaper();
        });

        document.getElementById('zoom-in').addEventListener('click', () => {
            this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2.0);
            this.updateZoom();
        });
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.4);
            this.updateZoom();
        });

        document.getElementById('btn-export-pdf').addEventListener('click', () => this.exportPDF());
    }

    updateZoom() {
        const paper = document.getElementById('paper-capture');
        const display = document.getElementById('zoom-display');
        if(paper) paper.style.transform = `scale(${this.zoomLevel})`;
        if(display) display.innerText = `${Math.round(this.zoomLevel * 100)}%`;
    }


    saveItem() {
        const title = document.getElementById('inp-title').value;
        const body = document.getElementById('inp-body').value;
        const page = parseInt(document.getElementById('inp-page').value);
        const image = document.getElementById('inp-img').value;
        const id = document.getElementById('edit-id').value;

        const data = { title, body, image };

        if (this.editingId && id) {
            const oldPage = this.findPageOfItem(id);
            if (oldPage) this.model.deleteNewsItem(oldPage, id);
            data.id = id;
        } 
        
        this.model.addNewsItem(page, data);
        this.resetForm();
        this.renderPaper();
    }

    loadToEdit(item) {
        this.editingId = item.id;
        document.getElementById('edit-id').value = item.id;
        document.getElementById('inp-title').value = item.title;
        document.getElementById('inp-body').value = item.body;
        document.getElementById('inp-img').value = item.image || '';
        document.getElementById('inp-page').value = this.findPageOfItem(item.id);
        
        const btn = document.getElementById('btn-submit');
        btn.innerHTML = '<i class="ph ph-floppy-disk mr-1"></i> Guardar';
        btn.classList.add('bg-blue-700');
        document.getElementById('btn-cancel').classList.remove('hidden');
    }

    resetForm() {
        this.editingId = null;
        document.getElementById('editor-form').reset();
        document.getElementById('edit-id').value = '';
        
        const btn = document.getElementById('btn-submit');
        btn.innerHTML = '<i class="ph ph-plus-circle mr-1"></i> Publicar';
        btn.classList.remove('bg-blue-700');
        document.getElementById('btn-cancel').classList.add('hidden');
    }

    findPageOfItem(id) {
        for(let p=1; p<=4; p++) {
            if(this.model.getItems(p).find(i => i.id === id)) return p;
        }
        return 1;
    }

    handleDragStart(e, item) {
        this.draggedItem = item;
        this.draggedFromPage = this.findPageOfItem(item.id);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify(item)); 
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedItem = null;
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    }

    setupPageDragEvents(pageEl) {
        pageEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            pageEl.classList.add('drag-over');
        });
        
        pageEl.addEventListener('dragleave', () => {
            pageEl.classList.remove('drag-over');
        });

        pageEl.addEventListener('drop', (e) => {
            e.preventDefault();
            pageEl.classList.remove('drag-over');
            
            const targetPage = parseInt(pageEl.dataset.page);
            if (this.draggedItem) {
                if (this.draggedFromPage !== targetPage) {
                    this.model.moveItem(this.draggedFromPage, targetPage, this.draggedItem.id);
                    this.renderPaper();
                }
            }
        });
    }

    exportPDF() {
        const element = document.getElementById('paper-capture');
        const opt = {
            margin: 0,
            filename: `${this.model.config.name.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'css', after: '.paper-page' }
        };
        html2pdf().set(opt).from(element).save();
    }

    destroy() {
        const css = document.getElementById('newspaper-css');
        if(css) css.remove();
        this.container.innerHTML = '';
    }
}