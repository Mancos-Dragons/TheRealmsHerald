import NewspaperModel from './NewspaperModel.js';
import NewspaperView from './NewspaperView.js';

export default class NewspaperController {
    constructor(container) {
        this.model = new NewspaperModel();
        this.view = new NewspaperView(container);
        this.zoomLevel = 0.9;
        this.draggedItem = null;
        this.draggedFromPage = null;
        this.resizeObserver = null;
    }

    async init() {
        this.loadStyles();
        await this.model.load();
        this.view.renderWorkspace(this.model.config);
        this.refreshPaper();
        this.attachEvents();
        this.initResizeObserver();
        console.log("📰 Controlador de Prensa: Listo.");
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

    refreshPaper() {
        const lastPage = this.model.getLastActivePage();
        const maxPages = lastPage + 1;
        const editionNum = this.model.getEditionNumber();
        this.view.renderPages(this.model.itemsByPage, this.model.config, maxPages, editionNum);
        const currentSel = document.getElementById('inp-page')?.value || 1;
        this.view.updatePageSelect(maxPages, currentSel);
        this.attachDynamicEvents();
        setTimeout(() => {
            this.applyMasonryLayout();
            this.checkOverflow(); 
        }, 50);
        this.waitForImages();
    }

    applyMasonryLayout() {
        const items = document.querySelectorAll('.news-item, .ad-box');
        items.forEach(item => {
            item.style.gridRowEnd = 'auto';
            const contentHeight = item.scrollHeight;
            const rowGap = 15; 
            const rowHeight = 1; 
            const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight));
            item.style.gridRowEnd = `span ${rowSpan}`;
        });
    }

    checkOverflow() {
        const pages = document.querySelectorAll('.paper-page');
        pages.forEach(page => {
            const pageNum = parseInt(page.dataset.page);
            const contentBox = page.querySelector('.columns-container');
            if(!contentBox) return;
            const pageBottom = page.clientHeight;
            const items = contentBox.querySelectorAll('.news-item, .ad-box');
            items.forEach(item => {
                const itemBottom = item.offsetTop + item.offsetHeight;
                if (itemBottom > (pageBottom - 40)) { 
                    item.classList.add('error-overflow');
                    item.title = "Click para mover a la siguiente página automáticamente";
                    item.onclick = (e) => {
                        e.stopPropagation();
                        if(confirm("Este artículo se sale de la hoja. ¿Mover a la siguiente página?")) {
                            this.model.moveItem(pageNum, pageNum + 1, item.dataset.id);
                            this.refreshPaper();
                        }
                    };
                }
            });
        });
    }

    waitForImages() {
        const imgs = document.querySelectorAll('.news-item img, .ad-box img');
        imgs.forEach(img => {
            if(img.complete) {
                this.applyMasonryLayout();
            } else {
                img.onload = () => {
                    this.applyMasonryLayout();
                    this.checkOverflow();
                };
            }
        });
    }

    initResizeObserver() {
        this.resizeObserver = new ResizeObserver(() => {
            this.applyMasonryLayout();
            this.checkOverflow();
        });
        const container = document.getElementById('paper-capture');
        if(container) this.resizeObserver.observe(container);
    }

    attachEvents() {
        const form = document.getElementById('editor-form');
        if (form) form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        const btnCancel = document.getElementById('btn-cancel');
        if (btnCancel) btnCancel.addEventListener('click', () => this.view.resetForm());
        
        const btnDelete = document.getElementById('btn-delete');
        if (btnDelete) btnDelete.addEventListener('click', () => this.handleDelete());

        const btnConfig = document.getElementById('btn-config-toggle');
        if (btnConfig) btnConfig.addEventListener('click', () => {
            this.fillConfigModal(); 
            this.view.toggleConfigModal(true);
        });
        
        const btnCloseModal = document.getElementById('btn-close-modal');
        if (btnCloseModal) btnCloseModal.addEventListener('click', () => this.view.toggleConfigModal(false));
        
        const btnSaveConfig = document.getElementById('btn-save-config');
        if (btnSaveConfig) btnSaveConfig.addEventListener('click', () => this.handleConfigSave());

        document.getElementById('zoom-in')?.addEventListener('click', () => {
            this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2.0);
            this.view.setZoom(this.zoomLevel);
        });
        document.getElementById('zoom-out')?.addEventListener('click', () => {
            this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.4);
            this.view.setZoom(this.zoomLevel);
        });
        document.getElementById('btn-export-pdf')?.addEventListener('click', () => this.exportPDF());
        
        document.getElementById('btn-new')?.addEventListener('click', () => {
            if(confirm("¿Borrar todo y empezar una nueva edición?")) {
                this.model.itemsByPage = { 1: [] };
                this.model.save();
                this.refreshPaper();
            }
        });
        document.getElementById('btn-save-json')?.addEventListener('click', () => this.downloadJSON());
        
        const btnImport = document.getElementById('btn-import');
        const fileInput = document.getElementById('file-import');
        if (btnImport && fileInput) {
            btnImport.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.uploadJSON(e));
        }
    }

    attachDynamicEvents() {
        const interactables = document.querySelectorAll('.news-item, .ad-box, .ad-banner-container');
        interactables.forEach(el => {
            if (el.classList.contains('error-overflow')) return;
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = el.dataset.id;
                let found = null;
                let page = 1;
                for(const [p, items] of Object.entries(this.model.itemsByPage)) {
                    const item = items.find(i => i.id === id);
                    if(item) { found = item; page = p; break; }
                }
                if(found) this.view.fillForm(found, page);
            });
            el.addEventListener('dragstart', (e) => {
                this.draggedItem = el.dataset.id;
                this.draggedFromPage = parseInt(el.closest('.paper-page').dataset.page);
                el.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            el.addEventListener('dragend', (e) => {
                el.classList.remove('dragging');
                document.querySelectorAll('.drag-over').forEach(d => d.classList.remove('drag-over'));
            });
        });
        document.querySelectorAll('.paper-page').forEach(pageEl => {
            pageEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                const container = pageEl.querySelector('.columns-container');
                if(container) {
                    pageEl.classList.add('drag-over');
                }
            });
            pageEl.addEventListener('dragleave', () => pageEl.classList.remove('drag-over'));
            pageEl.addEventListener('drop', (e) => {
                e.preventDefault();
                pageEl.classList.remove('drag-over');
                const targetPageEl = e.target.closest('.paper-page');
                if (!targetPageEl) return;
                const targetPage = parseInt(targetPageEl.dataset.page);
                const colsContainer = targetPageEl.querySelector('.columns-container');
                let newIndex = null;
                if (colsContainer) {
                    const afterElement = this.getDragAfterElement(colsContainer, e.clientY);
                    if (afterElement) {
                        const domChildren = Array.from(colsContainer.children);
                        newIndex = domChildren.indexOf(afterElement);
                    } else {
                        newIndex = null; 
                    }
                }
                if (this.draggedItem) {
                    this.model.moveItem(this.draggedFromPage, targetPage, this.draggedItem, newIndex);
                    this.refreshPaper();
                }
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.news-item:not(.dragging), .ad-box:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    fillConfigModal() {
        const c = this.model.config;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if(el) el.value = val || '';
        };
        
        setVal('modal-name', c.name);
        setVal('modal-price', c.price);
        setVal('modal-subtitle', c.subtitle);
        setVal('modal-texture', c.texture);
        setVal('modal-font', c.fontTheme);
        setVal('modal-base-date', c.baseDate);
        setVal('modal-current-date', c.currentDate);
        setVal('modal-freq', c.frequency);
        setVal('modal-manual', c.manualEdition);
    }

    handleFormSubmit() {
        const title = document.getElementById('inp-title').value;
        const body = document.getElementById('inp-body').value;
        const type = document.getElementById('inp-type').value; 
        const page = type === 'special' ? 1 : parseInt(document.getElementById('inp-page').value);
        const image = document.getElementById('inp-img').value;
        const id = document.getElementById('edit-id').value;
        
        let size = 'span-6';
        let specialStyle = null;
        let extra = null;
        let decreeIcon = null;
        let decreeImg = null;

        if (type === 'news') {
            size = document.getElementById('inp-size').value;
        } else if (type === 'ad') {
            size = document.getElementById('inp-ad-type').value; 
        } else if (type === 'special') {
            size = 'span-12';
            specialStyle = document.getElementById('inp-special-style').value;
            extra = document.getElementById('inp-extra').value;
            decreeIcon = document.getElementById('inp-decree-icon').value;
            decreeImg = document.getElementById('inp-decree-img').value;
        }

        const data = { title, body, image, type, size, specialStyle, extra, decreeIcon, decreeImg };

        if (id) {
            let oldPage = null;
            for(const [p, items] of Object.entries(this.model.itemsByPage)) {
                if(items.find(i => i.id === id)) { oldPage = p; break; }
            }
            if(oldPage) this.model.deleteNewsItem(oldPage, id);
            data.id = id;
        }

        if (type === 'special') {
            this.model.addSpecialItem(data);
        } else {
            this.model.addNewsItem(page, data);
        }

        this.view.resetForm();
        this.refreshPaper();
    }

    handleDelete() {
        const id = document.getElementById('edit-id').value;
        if (!id) return;
        
        if(confirm("¿Seguro que deseas eliminar este elemento?")) {
            let page = null;
            for(const [p, items] of Object.entries(this.model.itemsByPage)) {
                if(items.find(i => i.id === id)) { page = p; break; }
            }
            if(page) {
                this.model.deleteNewsItem(page, id);
                this.view.resetForm();
                this.refreshPaper();
            }
        }
    }

    handleConfigSave() {
        const name = document.getElementById('modal-name')?.value || "";
        const price = document.getElementById('modal-price')?.value || "";
        const subtitle = document.getElementById('modal-subtitle')?.value || "";
        const texture = document.getElementById('modal-texture')?.value || "texture-clean";
        const fontTheme = document.getElementById('modal-font')?.value || "font-royal";
        const today = new Date().toISOString().split('T')[0];
        const baseDate = document.getElementById('modal-base-date')?.value || today;
        const currentDate = document.getElementById('modal-current-date')?.value || today;
        const frequency = document.getElementById('modal-freq')?.value || "7";
        const manualEdition = document.getElementById('modal-manual')?.value || "0";

        this.model.setConfig({ 
            name, price, subtitle, texture, fontTheme, 
            baseDate, currentDate, frequency, manualEdition
        });
        
        this.view.toggleConfigModal(false);
        this.refreshPaper();
    }

    downloadJSON() {
        const json = this.model.toJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TheRealmsHerald_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    uploadJSON(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const success = this.model.fromJSON(event.target.result);
            if (success) {
                this.refreshPaper();
                alert("¡Archivo cargado con éxito!");
            } else {
                alert("Error: El pergamino está corrupto.");
            }
        };
        reader.readAsText(file);
    }

    exportPDF() {
        const element = document.getElementById('paper-capture');
        const opt = {
            margin: 0,
            filename: `${this.model.config.name}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'css', after: '.paper-page' }
        };
        html2pdf().set(opt).from(element).save();
    }

    destroy() {
        const css = document.getElementById('newspaper-css');
        if(css) css.remove();
        if(this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.view && this.view.container) {
            this.view.container.innerHTML = '';
        }
    }
}