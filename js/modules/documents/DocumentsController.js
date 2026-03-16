import DocumentsModel from './DocumentsModel.js';
import DocumentsView from './DocumentsView.js';
import { ModalService } from '../../core/ModalService.js';

export default class DocumentsController {
    constructor(container) {
        this.container = container;
        this.model = new DocumentsModel();
        this.view = new DocumentsView(container);
    }

    async init() {
        this.loadStyles();
        await this.model.load();
        this.view.renderWorkspace(this.model.getConfig());
        this.view.renderDocument(this.model.getConfig());
        this.attachEvents();
        console.log("📜 Controlador de Documentos: Listo.");
    }

    loadStyles() {
        if (!document.getElementById('documents-css')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './css/modules/documents.css';
            link.id = 'documents-css';
            document.head.appendChild(link);
        }
    }

    attachEvents() {
        const form = document.getElementById('docs-editor-form');
        if (form) {
            form.addEventListener('input', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                    const newValues = this.view.getFormValues();
                    this.model.setConfig(newValues);
                    this.view.renderDocument(this.model.getConfig());
                }
            });

            form.addEventListener('change', (e) => {
                if (e.target.tagName === 'SELECT') {
                    const newValues = this.view.getFormValues();
                    this.model.setConfig(newValues);
                    this.view.renderDocument(this.model.getConfig());
                }
            });
        }

        const btnExport = document.getElementById('btn-export-pdf');
        if (btnExport) {
            btnExport.addEventListener('click', () => this.exportPDF());
        }

        // Handle file uploads for custom textures and seals
        const handleFileUpload = (inputId, configKey) => {
            const fileInput = document.getElementById(inputId);
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const newValues = this.view.getFormValues();
                            newValues[configKey] = event.target.result;
                            this.model.setConfig(newValues);
                            this.view.renderWorkspace(this.model.getConfig());
                            this.view.renderDocument(this.model.getConfig());
                            this.attachEvents(); // Re-attach because workspace was re-rendered

                            // Set focus back or manage state to avoid losing cursor
                            const textInput = document.getElementById(`inp-${configKey.replace(/([A-Z])/g, "-$1").toLowerCase()}`);
                            if(textInput) textInput.value = event.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        };

        handleFileUpload('inp-custom-texture-file', 'customTexture');
        handleFileUpload('inp-custom-seal-file', 'customSeal');
    }

    async exportPDF() {
        const originalElement = document.getElementById('document-preview');
        if (!originalElement) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            await ModalService.alert("Aviso", "Por favor, permite ventanas emergentes para exportar el PDF.");
            return;
        }

        const clonedContent = originalElement.cloneNode(true);
        const basePath = window.location.origin + window.location.pathname.replace('index.html', '');

        clonedContent.querySelectorAll('img').forEach(img => {
            if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('http')) {
                img.src = new URL(img.getAttribute('src'), basePath).href;
            }
        });

        const config = this.model.getConfig();

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
        const safeTitle = config.title ? escapeHTML(config.title) : 'Documento';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${safeTitle}</title>
                <!-- Load required external styles -->
                <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Special+Elite&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Rye&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="${basePath}css/main.css">
                <link rel="stylesheet" href="${basePath}css/modules/documents.css">
                <style>
                    /* Fix missing backgrounds by injecting inline URLs that point directly to the assets based on absolute path */
                    .texture-clean { background-image: url('${basePath}assets/img/paper.png') !important; }
                    .texture-gritty { background-image: url('${basePath}assets/img/ag-square.png') !important; }
                    .texture-magic { background-image: url('${basePath}assets/img/stardust.png') !important; }

                    /* Print-specific overrides to guarantee A4 layout and background rendering */
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
                    #document-preview {
                        transform: none !important;
                        margin: 0 auto !important;
                        display: flex !important;
                    }
                    .paper-page {
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 auto !important;
                        padding: 15mm !important; /* Keep original padding */
                        box-shadow: none !important;
                        border: none !important;
                        position: relative;
                        box-sizing: border-box;
                        overflow: hidden;
                        display: flex !important;
                        flex-direction: column !important;
                        flex-shrink: 0 !important;
                    }
                    .doc-decree {
                        justify-content: center !important;
                        align-items: center !important;
                    }

                    /* Ensure backgrounds and filters print correctly */
                    .texture-clean, .texture-gritty, .texture-magic {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                </style>
            </head>
            <body>
                ${clonedContent.outerHTML}
                <script>
                    window.onload = () => {
                        // Wait slightly to ensure fonts and backgrounds load, then trigger print
                        setTimeout(() => {
                            window.print();
                        }, 500);
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
        const css = document.getElementById('documents-css');
        if(css) css.remove();
        if (this.view && this.view.container) {
            this.view.container.innerHTML = '';
        }
    }
}