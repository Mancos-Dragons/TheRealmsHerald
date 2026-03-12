import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsView {
    constructor(container) {
        this.container = container;
    }

    render() {
        const t = (key) => LanguageService.get(key);

        // Use basic translation, if not present fallback to actual text for now
        const title = t('tools.rumors.title') || "Susurros de Taberna";
        const desc = t('tools.rumors.desc') || "Generador de chismes y rumores procedurales.";

        this.container.innerHTML = `
            <div class="container-fluid h-100 overflow-y-auto custom-scrollbar py-5 fade-in bg-[#0d0d0d] text-gray-200">
                <div class="container max-w-4xl mx-auto">
                    <!-- Header -->
                    <div class="text-center mb-5">
                        <div class="mb-2"><i class="ph ph-mask-happy text-5xl text-amber-600"></i></div>
                        <h1 class="display-4 medieval-font text-amber-500 mb-2">${title}</h1>
                        <p class="lead text-gray-400">${desc}</p>
                    </div>

                    <!-- Config Panel -->
                    <div class="card bg-[#161616] border border-[#333] shadow-lg mb-4">
                        <div class="card-body p-4">
                            <h5 class="medieval-font text-amber-600 border-b border-[#333] pb-2 mb-4">Parámetros (Opcional)</h5>

                            <div class="row g-3">
                                <div class="col-md-4">
                                    <label class="form-label text-gray-400 text-sm">Pueblo/Ciudad</label>
                                    <input type="text" id="inp-town" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="Ej. Waterdeep">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label text-gray-400 text-sm">Personaje</label>
                                    <input type="text" id="inp-character" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="Ej. Elminster">
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label text-gray-400 text-sm">Rol</label>
                                    <input type="text" id="inp-role" class="form-control bg-[#222] border-[#444] text-gray-200" placeholder="Ej. Mercader">
                                </div>
                            </div>

                            <div class="mt-4 text-center">
                                <button id="btn-generate-rumor" class="btn btn-outline-warning px-5">
                                    <i class="ph ph-magic-wand"></i> Generar Rumor
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Results Panel -->
                    <div class="card bg-[#161616] border border-[#333] shadow-lg min-h-[300px]">
                        <div class="card-body p-4 relative">
                            <h5 class="medieval-font text-gray-200 border-b border-[#333] pb-2 mb-4">Rumores Escuchados</h5>

                            <ul id="rumors-list" class="space-y-3 custom-scrollbar overflow-y-auto max-h-[400px]">
                                <li class="text-gray-500 italic text-center py-4" id="empty-state">La taberna está en silencio... por ahora.</li>
                            </ul>

                            <div class="mt-4 text-end">
                                <button id="btn-clear-rumors" class="btn btn-sm btn-outline-danger">
                                    <i class="ph ph-trash"></i> Limpiar Taberna
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRumor(rumorText) {
        const list = this.container.querySelector('#rumors-list');
        const emptyState = this.container.querySelector('#empty-state');

        if (emptyState) {
            emptyState.remove();
        }

        const li = document.createElement('li');
        li.className = "p-3 bg-[#1f1f1f] border border-[#333] rounded text-gray-300 flex items-start gap-3 shadow fade-in";

        // Random icon for flavor
        const icons = ['ph-wine', 'ph-beer-bottle', 'ph-coffee', 'ph-brandy', 'ph-martini'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        li.innerHTML = `
            <i class="ph ${randomIcon} text-xl text-amber-700 mt-1 shrink-0"></i>
            <div>
                <p class="mb-0 text-sm md:text-base leading-relaxed">"${this.escapeHTML(rumorText)}"</p>
            </div>
        `;

        // Prepend so newest is at top
        list.insertBefore(li, list.firstChild);
    }

    clearRumors() {
        const list = this.container.querySelector('#rumors-list');
        list.innerHTML = '<li class="text-gray-500 italic text-center py-4" id="empty-state">La taberna está en silencio... por ahora.</li>';
    }

    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.innerText = str;
        return div.innerHTML;
    }
}
