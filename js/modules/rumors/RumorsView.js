import { LanguageService } from '../../core/LanguageService.js';

export class RumorsView {
    constructor(container) {
        this.container = container;
    }

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }

    render() {
        const t = (key) => LanguageService.get(key);
        // We'll map some translation keys directly or use fallback strings if not added yet.
        const title = t('tools.rumors.title') || 'Susurros de Taberna';
        const desc = t('tools.rumors.desc') || 'Generador de chismes y rumores procedurales.';

        this.container.innerHTML = `
            <div class="container-fluid h-100 overflow-y-auto custom-scrollbar p-4 fade-in">
                <!-- Header -->
                <div class="row mb-4 border-bottom border-secondary pb-3 align-items-center">
                    <div class="col">
                        <h2 class="medieval-font text-warning mb-0"><i class="ph ph-mask-happy"></i> ${title}</h2>
                        <p class="text-secondary small mb-0">${desc}</p>
                    </div>
                </div>

                <div class="row h-100">
                    <!-- Left Sidebar: Controls -->
                    <div class="col-md-4 col-lg-3 h-100 d-flex flex-column border-end border-secondary pe-3">
                        <div class="mb-4">
                            <label class="form-label text-warning small fw-bold">Contexto Personalizado (Opcional)</label>

                            <div class="mb-3">
                                <label class="form-label text-secondary small">Sujeto / Personaje</label>
                                <input type="text" id="rumor-subject" class="form-control bg-dark text-light border-secondary" placeholder="Ej: El Rey Arturo">
                            </div>

                            <div class="mb-3">
                                <label class="form-label text-secondary small">Lugar / Pueblo</label>
                                <input type="text" id="rumor-location" class="form-control bg-dark text-light border-secondary" placeholder="Ej: Camelot">
                            </div>
                        </div>

                        <button id="btn-generate-rumor" class="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2 mb-3">
                            <i class="ph ph-dice-five"></i> Generar Rumor
                        </button>
                    </div>

                    <!-- Right Main Area: Output -->
                    <div class="col-md-8 col-lg-9 h-100 d-flex flex-column">
                        <h5 class="text-warning medieval-font mb-3 border-bottom border-dark pb-2">Rumores Escuchados</h5>

                        <!-- List container -->
                        <div id="rumors-list" class="flex-grow-1 overflow-y-auto custom-scrollbar pe-2 d-flex flex-column gap-3">
                            <div class="text-center text-secondary p-5" id="rumors-empty-state">
                                <i class="ph ph-ear text-5xl mb-2"></i>
                                <p>La taberna está en silencio... por ahora.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRumor(rumorData) {
        const listContainer = this.container.querySelector('#rumors-list');
        const emptyState = this.container.querySelector('#rumors-empty-state');

        if (emptyState) {
            emptyState.remove();
        }

        const safeText = this.escapeHTML(rumorData.text);
        const time = new Date(rumorData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const rumorCard = document.createElement('div');
        rumorCard.className = 'card bg-[#1a1a1a] border border-[#333] shadow-sm fade-in';
        rumorCard.innerHTML = `
            <div class="card-body p-3 d-flex gap-3 align-items-start">
                <div class="text-secondary opacity-50 pt-1">
                    <i class="ph ph-quotes text-2xl"></i>
                </div>
                <div class="flex-grow-1">
                    <p class="mb-2 text-gray-200 fs-5 font-serif" style="font-family: 'Old Standard TT', serif;">
                        "${safeText}"
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-secondary"><i class="ph ph-clock"></i> ${time}</small>
                        <button class="btn btn-sm btn-outline-secondary py-0 px-2 btn-copy-rumor" title="Copiar al portapapeles">
                            <i class="ph ph-copy"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Prepend so newest is at the top
        listContainer.prepend(rumorCard);

        // Add copy functionality
        const copyBtn = rumorCard.querySelector('.btn-copy-rumor');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(rumorData.text).then(() => {
                const icon = copyBtn.querySelector('i');
                icon.className = 'ph ph-check text-success';
                setTimeout(() => { icon.className = 'ph ph-copy'; }, 2000);
            });
        });
    }

    getCustomContext() {
        return {
            subject: this.container.querySelector('#rumor-subject').value.trim(),
            location: this.container.querySelector('#rumor-location').value.trim()
        };
    }
}
