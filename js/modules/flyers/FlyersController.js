import FlyersModel from './FlyersModel.js';
import FlyersView from './FlyersView.js';
import { ModalService } from '../../core/ModalService.js';

export default class FlyersController {
    constructor(container) {
        this.container = container;
        this.model = new FlyersModel();
        this.view = new FlyersView(container);

        // Drag state
        this.isDragging = false;
        this.draggedElement = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;

        // Bound event listeners
        this.onMouseMove = this.handleMouseMove.bind(this);
        this.onMouseUp = this.handleMouseUp.bind(this);
        this.onMouseDown = this.handleMouseDown.bind(this);
    }

    async init() {
        this.view.renderWorkspace(this.model.getConfig());
        this.view.renderCanvas(this.model);
        this.attachEvents();

        console.log("📣 Controlador de Pregonero: Listo.");
    }

    loadStyles() {
        if (!document.getElementById('flyers-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './css/modules/flyers.css';
            link.id = 'flyers-css';
            document.head.appendChild(link);
        }
    }

    attachEvents() {
        this.loadStyles();

        // Ensure global listeners are active
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);

        const form = document.getElementById('flyers-editor-form');
        if (form) {
            form.addEventListener('change', (e) => {
                if (e.target.tagName === 'SELECT') {
                    const newValues = this.view.getFormValues();
                    this.model.setConfig(newValues);
                    this.view.renderCanvas(this.model);
                }
            });
        }

        const btnAddText = document.getElementById('btn-add-text');
        if (btnAddText) {
            btnAddText.addEventListener('click', () => {
                const textInput = document.getElementById('flyer-new-text');
                const content = textInput.value.trim();
                if (content) {
                    this.model.addElement('text', { content });
                    textInput.value = '';
                    this.view.renderCanvas(this.model);
                }
            });
        }

        const btnAddImg = document.getElementById('btn-add-img');
        if (btnAddImg) {
            btnAddImg.addEventListener('click', () => {
                const urlInput = document.getElementById('flyer-img-url');
                const url = urlInput.value.trim();
                if (url) {
                    this.model.addElement('image', { src: url });
                    urlInput.value = '';
                    this.view.renderCanvas(this.model);
                }
            });
        }

        const imgFile = document.getElementById('flyer-img-file');
        if (imgFile) {
            imgFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.model.addElement('image', { src: event.target.result });
                        imgFile.value = '';
                        this.view.renderCanvas(this.model);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        const canvas = document.getElementById('flyer-canvas');
        if (canvas) {
            if (canvas.dataset.eventsAttached !== 'true') {
                canvas.addEventListener('remove-flyer-element', (e) => {
                    this.model.removeElement(e.detail.id);
                    this.view.renderCanvas(this.model);
                });
                canvas.addEventListener('resize-flyer-element', (e) => {
                    this.model.updateElement(e.detail.id, { scale: e.detail.scale });
                    this.view.renderCanvas(this.model);
                });
                canvas.dataset.eventsAttached = 'true';
            }
        }

        const btnExportPdf = document.getElementById('btn-export-pdf');
        if (btnExportPdf) {
            btnExportPdf.addEventListener('click', () => this.exportPDF());
        }

        this.attachDragEvents();
    }

    attachDragEvents() {
        const container = document.getElementById('flyer-canvas-container');
        if(!container) return;

        // Ensure we don't attach multiple times if events are re-run
        if (container.dataset.dragEventsAttached === 'true') return;

        // Attach mousedown event via delegation to the container
        container.addEventListener('mousedown', this.onMouseDown);
        container.dataset.dragEventsAttached = 'true';
    }

    handleMouseDown(e) {
        const flyerEl = e.target.closest('.flyer-element');
        if (flyerEl) {
            // Prevent drag if clicking on the delete button
            if (e.target.closest('button')) return;

            this.isDragging = true;
            this.draggedElement = flyerEl;

            const elRect = flyerEl.getBoundingClientRect();

            // Calculate where inside the element the user clicked
            this.dragOffsetX = e.clientX - elRect.left;
            this.dragOffsetY = e.clientY - elRect.top;

            flyerEl.style.zIndex = 1000;
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.draggedElement) return;

        const canvas = document.getElementById('flyer-canvas');
        if (!canvas) return;

        const canvasRect = canvas.getBoundingClientRect();

        // Calculate new position relative to canvas
        let newX = e.clientX - canvasRect.left - this.dragOffsetX;
        let newY = e.clientY - canvasRect.top - this.dragOffsetY;

        // Account for CSS scale
        const container = document.getElementById('flyer-canvas-container');
        const scale = container ? container.getBoundingClientRect().width / container.offsetWidth : 1;

        newX = newX / scale;
        newY = newY / scale;

        // Apply visual update immediately
        this.draggedElement.style.left = `${newX}px`;
        this.draggedElement.style.top = `${newY}px`;
    }

    handleMouseUp(e) {
        if (this.isDragging && this.draggedElement) {
            const id = this.draggedElement.dataset.id;
            const newX = parseFloat(this.draggedElement.style.left);
            const newY = parseFloat(this.draggedElement.style.top);

            // Update model
            this.model.updateElement(id, { x: newX, y: newY });

            this.draggedElement.style.zIndex = '';

            this.isDragging = false;
            this.draggedElement = null;
        }
    }

    async exportPDF() {
        const originalElement = document.getElementById('flyer-canvas-container');
        if (!originalElement) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            await ModalService.alert("Aviso", "Por favor, permite ventanas emergentes para exportar el PDF.");
            return;
        }

        const clonedContent = originalElement.cloneNode(true);
        const basePath = window.location.origin + window.location.pathname.replace('index.html', '');

        // Resolve absolute URLs for any images on canvas
        clonedContent.querySelectorAll('img').forEach(img => {
            if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('http')) {
                img.src = new URL(img.getAttribute('src'), basePath).href;
            }
        });

        // Remove delete buttons and resize controls
        clonedContent.querySelectorAll('button').forEach(btn => btn.remove());
        clonedContent.querySelectorAll('.btn-resize').forEach(el => el.remove());
        // Remove hover/border effects
        clonedContent.querySelectorAll('.flyer-element').forEach(el => {
            el.classList.remove('hover:border-amber-500/50', 'hover:bg-amber-500/10', 'border', 'border-transparent');
            el.style.border = 'none';
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Pregonero Visual</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Special+Elite&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="${basePath}css/main.css">
                <link rel="stylesheet" href="${basePath}css/modules/flyers.css">
                <style>
                    /* Absolute texture paths for printing */
                    .texture-clean { background-image: url('${basePath}assets/img/paper.png') !important; }
                    .texture-gritty { background-image: url('${basePath}assets/img/ag-square.png') !important; }
                    .texture-magic { background-image: url('${basePath}assets/img/stardust.png') !important; }

                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: #fff;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #flyer-canvas-container {
                        transform: none !important;
                        margin: 0 auto !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        box-shadow: none !important;
                        position: relative;
                        box-sizing: border-box;
                        overflow: hidden;
                        display: block !important;
                    }
                    /* Ensure backgrounds and filters print correctly */
                    .texture-clean, .texture-gritty, .texture-magic, #flyer-canvas-bg {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    img {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                </style>
            </head>
            <body>
                ${clonedContent.outerHTML}
                <script>
                    window.onload = () => {
                        setTimeout(() => {
                            window.print();
                        }, 1500); // Give tailwind time to process classes
                    };
                </script>
            </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }

    destroy() {
        // Remove global event listeners
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);

        const css = document.getElementById('flyers-css');
        if(css) css.remove();
        if (this.view && this.view.container) {
            this.view.container.innerHTML = '';
        }
    }
}
