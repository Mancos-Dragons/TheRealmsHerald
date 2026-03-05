import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsView {
    constructor(container) {
        this.container = container;
    }

    render(model) {
        const html = `
            <div class="container py-4 fade-in">
                <div class="row mb-4">
                    <div class="col-12 text-center">
                        <i class="ph ph-mask-happy text-5xl text-amber-500 mb-2"></i>
                        <h2 class="medieval-font text-amber-500">Susurros de Taberna</h2>
                        <p class="text-gray-400">Generador de chismes y rumores procedurales para Dungeon Masters.</p>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">
                        <div class="card bg-[#161616] border border-[#333] shadow-lg mb-4">
                            <div class="card-body p-4">
                                <h5 class="card-title text-gray-200 mb-3"><i class="ph ph-sliders"></i> Variables Iniciales</h5>

                                <div class="mb-3">
                                    <label class="form-label text-gray-400 small">Nombre del Pueblo / Ciudad</label>
                                    <input type="text" id="input-town-name" class="form-control bg-[#0d0d0d] text-gray-200 border-secondary" placeholder="Ej: Vado Verde">
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-gray-400 small">Nombre del Personaje</label>
                                        <input type="text" id="input-npc-name" class="form-control bg-[#0d0d0d] text-gray-200 border-secondary" placeholder="Ej: Silas">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label text-gray-400 small">Rol o Profesión</label>
                                        <input type="text" id="input-npc-role" class="form-control bg-[#0d0d0d] text-gray-200 border-secondary" placeholder="Ej: Herrero">
                                    </div>
                                </div>

                                <button id="btn-generate-rumor" class="btn btn-warning w-100 mt-2">
                                    <i class="ph ph-sparkle"></i> Generar Rumor
                                </button>
                            </div>
                        </div>

                        <div id="rumor-result-container" class="card bg-[#161616] border border-[#333] shadow-lg d-none">
                            <div class="card-body p-4">
                                <div class="d-flex align-items-center mb-3">
                                    <i class="ph ph-ear text-amber-500 text-2xl me-2"></i>
                                    <h5 class="card-title text-gray-200 m-0">El Rumor</h5>
                                </div>
                                <div class="bg-[#0d0d0d] p-3 rounded border border-secondary mb-4">
                                    <p id="output-rumor-text" class="text-gray-300 m-0 fst-italic">...</p>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <i class="ph ph-notebook text-info text-2xl me-2"></i>
                                    <h5 class="card-title text-gray-200 m-0">Notas del DM</h5>
                                </div>
                                <div class="bg-[#0d0d0d] p-3 rounded border border-secondary">
                                    <p id="output-rumor-hook" class="text-gray-300 m-0 small">...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = html;
    }

    updateResult({ rumor, hook }) {
        const container = this.container.querySelector('#rumor-result-container');
        const rumorTextEl = this.container.querySelector('#output-rumor-text');
        const hookTextEl = this.container.querySelector('#output-rumor-hook');

        if (container && rumorTextEl && hookTextEl) {
            rumorTextEl.textContent = rumor;
            hookTextEl.textContent = hook;
            container.classList.remove('d-none');
        }
    }
}