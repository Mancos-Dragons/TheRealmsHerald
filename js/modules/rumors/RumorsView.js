import { LanguageService } from '../../core/LanguageService.js';

export default class RumorsView {
    constructor(container) {
        this.container = container;
    }

    render(variables, rumors) {
        const t = (key) => LanguageService.get(key) || key;

        this.container.innerHTML = `
            <div class="container-fluid h-100 py-4 custom-scrollbar overflow-y-auto">
                <div class="row w-100 max-w-6xl mx-auto h-100">
                    <!-- Columna Izquierda: Variables -->
                    <div class="col-md-4 h-100">
                        <div class="card bg-[#161616] border border-[#333] shadow-lg h-100">
                            <div class="card-header border-bottom border-[#333] bg-black py-3 d-flex justify-content-between align-items-center">
                                <h5 class="medieval-font text-amber-500 mb-0 d-flex align-items-center gap-2">
                                    <i class="ph ph-mask-happy text-2xl"></i> Variables
                                </h5>
                            </div>
                            <div class="card-body overflow-y-auto custom-scrollbar">
                                <form id="form-variables">
                                    <div class="mb-3">
                                        <label class="form-label text-gray-300 small" data-i18n="rumors.town_name">Pueblo/Ciudad</label>
                                        <input type="text" id="inp-town-name" class="form-control bg-[#222] border-[#444] text-white" value="${variables.townName}">
                                    </div>
                                    <hr class="border-[#444]">
                                    <div class="mb-3">
                                        <label class="form-label text-gray-300 small" data-i18n="rumors.characters">Personajes Relevantes</label>
                                        <div class="d-flex gap-2 mb-2">
                                            <input type="text" id="inp-char-name" class="form-control form-control-sm bg-[#222] border-[#444] text-white" placeholder="Nombre">
                                            <input type="text" id="inp-char-role" class="form-control form-control-sm bg-[#222] border-[#444] text-white" placeholder="Rol (ej. Guardia)">
                                            <button type="button" id="btn-add-character" class="btn btn-sm btn-outline-warning">
                                                <i class="ph ph-plus"></i>
                                            </button>
                                        </div>
                                        <ul id="characters-list" class="list-group list-group-flush bg-transparent">
                                            <!-- Renderizado dinámico -->
                                        </ul>
                                    </div>

                                    <button type="button" id="btn-generate-rumor" class="btn btn-warning w-100 mt-4 medieval-font">
                                        <i class="ph ph-magic-wand"></i> Generar Rumor
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Columna Derecha: Rumores Generados -->
                    <div class="col-md-8 h-100">
                        <div class="card bg-[#161616] border border-[#333] shadow-lg h-100">
                            <div class="card-header border-bottom border-[#333] bg-black py-3">
                                <h5 class="medieval-font text-amber-500 mb-0 d-flex align-items-center gap-2">
                                    <i class="ph ph-scroll text-2xl"></i> Rumores Generados
                                </h5>
                            </div>
                            <div class="card-body p-4 bg-[#0a0a0a] overflow-y-auto custom-scrollbar" id="rumors-container">
                                <!-- Aquí van los rumores generados -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderCharactersList(variables.characters);
        this.renderRumorsList(rumors);
    }

    renderCharactersList(characters) {
        const listContainer = this.container.querySelector('#characters-list');
        if (!listContainer) return;

        listContainer.innerHTML = characters.map(char => `
            <li class="list-group-item bg-transparent text-gray-300 border-[#333] px-0 py-2 d-flex justify-content-between align-items-center">
                <span><i class="ph ph-user text-amber-600 me-2"></i> ${char.name} <small class="text-gray-500">(${char.role})</small></span>
                <button type="button" class="btn btn-sm btn-link text-danger p-0 btn-delete-character" data-id="${char.id}">
                    <i class="ph ph-trash"></i>
                </button>
            </li>
        `).join('');
    }

    renderRumorsList(rumors) {
        const container = this.container.querySelector('#rumors-container');
        if (!container) return;

        if (rumors.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 my-5">
                    <i class="ph ph-ghost text-5xl mb-3 opacity-50"></i>
                    <p>Las tabernas están inusualmente calladas...</p>
                    <small>Genera un rumor para empezar.</small>
                </div>
            `;
            return;
        }

        container.innerHTML = rumors.map(rumor => {
            const isEvent = rumor.type === 'event';
            const bgClass = rumor.used ? 'bg-[#111] opacity-50' : 'bg-[#1a1a1a]';
            const icon = isEvent ? '<i class="ph ph-warning-circle text-danger"></i>' : '<i class="ph ph-chat-circle text-info"></i>';
            const typeLabel = isEvent ? '<span class="badge bg-danger ms-2">Posible Evento</span>' : '<span class="badge bg-info ms-2">Chisme</span>';
            const strike = rumor.used ? 'text-decoration-line-through text-gray-600' : 'text-gray-200';

            return `
                <div class="card ${bgClass} border border-[#333] mb-3 transition-all">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <div class="d-flex align-items-center mb-2">
                                    ${icon} ${typeLabel}
                                </div>
                                <p class="mb-0 font-serif text-lg ${strike}">${rumor.text}</p>
                            </div>
                            <div class="d-flex gap-2 ms-3">
                                <button class="btn btn-sm ${rumor.used ? 'btn-outline-secondary' : 'btn-outline-success'} btn-toggle-used" data-id="${rumor.id}" title="Marcar como usado">
                                    <i class="ph ${rumor.used ? 'ph-arrow-counter-clockwise' : 'ph-check'}"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger btn-delete-rumor" data-id="${rumor.id}" title="Eliminar">
                                    <i class="ph ph-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}
