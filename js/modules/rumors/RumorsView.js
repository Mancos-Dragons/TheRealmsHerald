import { LanguageService } from '../../core/LanguageService.js';
import { DOMHelper } from '../../core/DOMHelper.js';

export default class RumorsView {
    constructor(container) {
        this.container = container;
    }

    renderWorkspace(model) {
        const t = (key) => LanguageService.get(key);

        this.container.innerHTML = `
            <div class="container-fluid h-100 p-0 d-flex flex-column fade-in text-gray-200">
                <!-- Toolbar -->
                <div class="bg-[#111] border-bottom border-[#333] p-2 px-4 flex justify-between items-center shadow-md z-10">
                    <div class="flex items-center gap-3">
                        <i class="ph ph-mask-happy text-amber-500 text-3xl"></i>
                        <h4 class="m-0 medieval-font text-gray-200" data-i18n="tools.rumors.title">Susurros de Taberna</h4>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-warning shadow-sm hover-scale" id="btn-generate-rumor">
                            <i class="ph ph-sparkle"></i> Generar Rumor
                        </button>
                    </div>
                </div>

                <div class="d-flex flex-1 overflow-hidden">
                    <!-- Left Sidebar (Context Variables) -->
                    <div class="w-80 bg-[#161616] border-end border-[#333] p-4 overflow-y-auto custom-scrollbar shadow-lg z-0">
                        <h6 class="text-amber-500 medieval-font mb-4 border-bottom border-[#444] pb-2">
                            <i class="ph ph-map-pin"></i> Entorno
                        </h6>

                        <div class="mb-4">
                            <label class="form-label text-sm text-gray-400">Nombre del Pueblo/Ciudad</label>
                            <input type="text" class="form-control form-control-sm bg-[#0d0d0d] text-gray-200 border-[#444] rounded"
                                   id="inp-town-name" value="${DOMHelper.escapeHTML(model.townName)}" placeholder="Ej: Vado de la Ceniza">
                        </div>

                        <h6 class="text-amber-500 medieval-font mb-3 mt-5 border-bottom border-[#444] pb-2">
                            <i class="ph ph-users"></i> Personajes
                        </h6>

                        <div class="input-group mb-2">
                            <input type="text" id="inp-char-name" class="form-control form-control-sm bg-[#0d0d0d] text-gray-200 border-[#444]" placeholder="Nombre">
                            <input type="text" id="inp-char-role" class="form-control form-control-sm bg-[#0d0d0d] text-gray-200 border-[#444]" placeholder="Rol (Ej: Herrero)">
                            <button class="btn btn-sm btn-outline-secondary" id="btn-add-char" title="Añadir">
                                <i class="ph ph-plus"></i>
                            </button>
                        </div>
                        <ul class="list-group list-group-flush bg-transparent" id="list-characters">
                        </ul>

                        <h6 class="text-amber-500 medieval-font mb-3 mt-5 border-bottom border-[#444] pb-2">
                            <i class="ph ph-map-trifold"></i> Lugares
                        </h6>

                        <div class="input-group mb-2">
                            <input type="text" id="inp-loc-name" class="form-control form-control-sm bg-[#0d0d0d] text-gray-200 border-[#444]" placeholder="Lugar (Ej: El Bosque Oscuro)">
                            <button class="btn btn-sm btn-outline-secondary" id="btn-add-loc" title="Añadir">
                                <i class="ph ph-plus"></i>
                            </button>
                        </div>
                        <ul class="list-group list-group-flush bg-transparent" id="list-locations">
                        </ul>
                    </div>

                    <!-- Main Content (Rumors List) -->
                    <div class="flex-1 bg-[#0d0d0d] p-5 overflow-y-auto custom-scrollbar relative">
                        <div class="max-w-4xl mx-auto">
                            <div class="flex justify-between items-end mb-4 border-bottom border-[#333] pb-2">
                                <h3 class="medieval-font text-amber-600 m-0">Rumores Recientes</h3>
                                <span class="text-xs text-gray-500">Haz clic en generar para obtener nuevos chismes.</span>
                            </div>

                            <div id="rumors-container" class="space-y-4">
                                <!-- Rumors will be injected here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderCharacters(model.characters);
        this.renderLocations(model.locations);
        this.renderRumors(model.rumors);
    }

    renderCharacters(chars) {
        const list = this.container.querySelector('#list-characters');
        list.innerHTML = '';
        chars.forEach(char => {
            const li = document.createElement('li');
            li.className = "list-group-item bg-transparent border-[#333] px-0 py-2 d-flex justify-content-between align-items-center text-sm";
            li.innerHTML = `
                <div>
                    <span class="text-gray-300 font-bold">${DOMHelper.escapeHTML(char.name)}</span>
                    <span class="text-gray-500 text-xs d-block">${DOMHelper.escapeHTML(char.role)}</span>
                </div>
                <button class="btn btn-sm text-danger hover:bg-[#333] border-0 btn-del-char" data-id="${char.id}">
                    <i class="ph ph-trash"></i>
                </button>
            `;
            list.appendChild(li);
        });
    }

    renderLocations(locs) {
        const list = this.container.querySelector('#list-locations');
        list.innerHTML = '';
        locs.forEach(loc => {
            const li = document.createElement('li');
            li.className = "list-group-item bg-transparent border-[#333] px-0 py-2 d-flex justify-content-between align-items-center text-sm";
            li.innerHTML = `
                <span class="text-gray-300">${DOMHelper.escapeHTML(loc.name)}</span>
                <button class="btn btn-sm text-danger hover:bg-[#333] border-0 btn-del-loc" data-id="${loc.id}">
                    <i class="ph ph-trash"></i>
                </button>
            `;
            list.appendChild(li);
        });
    }

    renderRumors(rumors) {
        const container = this.container.querySelector('#rumors-container');
        container.innerHTML = '';

        if (rumors.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 text-gray-600">
                    <i class="ph ph-ear text-5xl mb-3 opacity-50"></i>
                    <p class="medieval-font text-lg">La taberna está en silencio...</p>
                    <p class="text-sm">Agrega algunos personajes y lugares, luego genera un rumor.</p>
                </div>
            `;
            return;
        }

        rumors.forEach(rumor => {
            const el = document.createElement('div');
            el.className = "bg-[#1a1a1a] border border-[#333] rounded p-4 shadow-sm relative group transition-all hover:border-[#555]";

            // Truth indicator icon
            const isTrueIcon = rumor.isTrue ? '<i class="ph ph-check-circle text-success" title="Verdad"></i>' : '<i class="ph ph-x-circle text-danger" title="Falso"></i>';
            const statusClass = rumor.status === 'resolved' ? 'opacity-50 line-through' : '';

            el.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider font-bold">
                        <i class="ph ph-quotes"></i> Susurro
                    </div>
                    <div class="flex items-center gap-2">
                        ${isTrueIcon}
                        <button class="btn btn-sm text-gray-500 hover:text-white border-0 p-1 btn-toggle-truth" data-id="${rumor.id}" title="Alternar Verdad/Falso">
                            <i class="ph ph-arrows-left-right"></i>
                        </button>
                        <button class="btn btn-sm text-gray-500 hover:text-danger border-0 p-1 btn-del-rumor" data-id="${rumor.id}" title="Eliminar">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </div>

                <p class="text-gray-200 text-lg medieval-font mb-3 ${statusClass}">${DOMHelper.escapeHTML(rumor.text)}</p>

                <div class="flex justify-between items-center text-sm border-top border-[#333] pt-2">
                    <div class="flex items-center gap-2 text-gray-400">
                        <i class="ph ph-user"></i>
                        <span contenteditable="true" class="outline-none border-b border-dashed border-[#555] hover:border-gray-300 transition-colors source-edit" data-id="${rumor.id}">${DOMHelper.escapeHTML(rumor.source || 'Anónimo')}</span>
                    </div>

                    <button class="btn btn-sm btn-outline-secondary py-0 text-xs btn-status-toggle" data-id="${rumor.id}">
                        ${rumor.status === 'active' ? 'Marcar Resuelto' : 'Reactivar'}
                    </button>
                </div>
            `;
            container.appendChild(el);
        });
    }

    clearCharInputs() {
        this.container.querySelector('#inp-char-name').value = '';
        this.container.querySelector('#inp-char-role').value = '';
    }

    clearLocInput() {
        this.container.querySelector('#inp-loc-name').value = '';
    }
}
