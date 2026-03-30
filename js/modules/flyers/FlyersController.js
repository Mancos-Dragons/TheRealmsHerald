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

        // Resize state
        this.isResizing = false;
        this.initialDistance = 0;
        this.initialScale = 1;
        this.initialCenterX = 0;
        this.initialCenterY = 0;

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
        if (!flyerEl) return;

        // Check if clicking delete button
        if (e.target.closest('button.btn-del')) return;

        const isHandle = e.target.classList.contains('resize-handle');
        this.draggedElement = flyerEl;
        flyerEl.style.zIndex = 1000;

        const elRect = flyerEl.getBoundingClientRect();
        const container = document.getElementById('flyer-canvas-container');
        const canvasScale = container ? container.getBoundingClientRect().width / container.offsetWidth : 1;

        if (isHandle) {
            this.isResizing = true;

            // Calculate initial distance to center
            this.initialCenterX = elRect.left + elRect.width / 2;
            this.initialCenterY = elRect.top + elRect.height / 2;
            this.initialDistance = Math.sqrt(Math.pow(e.clientX - this.initialCenterX, 2) + Math.pow(e.clientY - this.initialCenterY, 2));

            // Get current scale from model
            const id = flyerEl.dataset.id;
            const elementData = this.model.elements.find(el => el.id === id);
            this.initialScale = elementData ? (elementData.scale || 1) : 1;

        } else {
            this.isDragging = true;

            // Calculate where inside the element the user clicked
            this.dragOffsetX = e.clientX - elRect.left;
            this.dragOffsetY = e.clientY - elRect.top;
        }
    }

    handleMouseMove(e) {
        if (!this.draggedElement) return;

        const canvas = document.getElementById('flyer-canvas');
        if (!canvas) return;

        const container = document.getElementById('flyer-canvas-container');
        const canvasScale = container ? container.getBoundingClientRect().width / container.offsetWidth : 1;

        if (this.isResizing) {
            const currentDistance = Math.sqrt(Math.pow(e.clientX - this.initialCenterX, 2) + Math.pow(e.clientY - this.initialCenterY, 2));

            // Calculate scale ratio based on initial distance
            let ratio = currentDistance / this.initialDistance;
            let newScale = this.initialScale * ratio;

            // Clamp scale bounds
            newScale = Math.max(0.2, Math.min(newScale, 5));

            const id = this.draggedElement.dataset.id;
            const elementData = this.model.elements.find(el => el.id === id);

            if (elementData) {
                // Apply visual change immediately for smooth UX
                const contentContainer = this.draggedElement.querySelector('.pointer-events-none');
                if (contentContainer) {
                    if (elementData.type === 'text') {
                        const textDiv = contentContainer.querySelector('div');
                        if (textDiv) textDiv.style.fontSize = `${newScale * 24}px`;
                    } else if (elementData.type === 'image') {
                        const img = contentContainer.querySelector('img');
                        if (img) img.style.width = `${newScale * 250}px`;
                    }
                }

                // Track scale temporarily on DOM for MouseUp
                this.draggedElement.dataset.tempScale = newScale;
            }

        } else if (this.isDragging) {
            const canvasRect = canvas.getBoundingClientRect();

            // Calculate new position relative to canvas
            let newX = e.clientX - canvasRect.left - this.dragOffsetX;
            let newY = e.clientY - canvasRect.top - this.dragOffsetY;

            newX = newX / canvasScale;
            newY = newY / canvasScale;

            // Apply visual update immediately
            this.draggedElement.style.left = `${newX}px`;
            this.draggedElement.style.top = `${newY}px`;
        }
    }

    handleMouseUp(e) {
        if (this.draggedElement) {
            const id = this.draggedElement.dataset.id;

            if (this.isResizing) {
                const tempScale = parseFloat(this.draggedElement.dataset.tempScale);
                if (!isNaN(tempScale)) {
                    this.model.updateElement(id, { scale: tempScale });
                }
                delete this.draggedElement.dataset.tempScale;
            } else if (this.isDragging) {
                const newX = parseFloat(this.draggedElement.style.left);
                const newY = parseFloat(this.draggedElement.style.top);
                this.model.updateElement(id, { x: newX, y: newY });
            }

            this.draggedElement.style.zIndex = '';
            this.isDragging = false;
            this.isResizing = false;
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

        // Remove delete buttons and resize handles
        clonedContent.querySelectorAll('button').forEach(btn => btn.remove());
        clonedContent.querySelectorAll('.resize-handle').forEach(el => el.remove());
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
