import { LanguageService } from '../../core/LanguageService.js';

export default class HomeController {
    constructor(container) {
        this.container = container;
        this.versionData = null;
        
        this.tools = [
            { id: 'newspaper', icon: 'ph-newspaper', locked: false },
            { id: 'rumors', icon: 'ph-mask-happy', locked: true },
            { id: 'public_opinion', icon: 'ph-users-three', locked: true },
            { id: 'npcs', icon: 'ph-user-focus', locked: true },
            { id: 'timeline', icon: 'ph-hourglass', locked: true },
            { id: 'documents', icon: 'ph-scroll', locked: true },
            { id: 'factions', icon: 'ph-crown', locked: true },
            { id: 'secrets', icon: 'ph-key', locked: true },
            { id: 'summary', icon: 'ph-book-open', locked: true },
            { id: 'chaos', icon: 'ph-lightning', locked: true },
            { id: 'consequences', icon: 'ph-gavel', locked: true },
            { id: 'maps', icon: 'ph-map-trifold', locked: true },
            { id: 'labs', icon: 'ph-flask', locked: true }
        ];
    }

    async init() {
        try {
            const response = await fetch('./data/version.json');
            this.versionData = await response.json();
        } catch (e) {
            this.versionData = { changelog: [], roadmap: [] };
        }
        this.render();
    }

    render() {
        const t = (key) => LanguageService.get(key);
        
        const toolsHTML = this.tools.map(tool => {
            const opacity = tool.locked ? 'opacity-50 grayscale' : 'hover-scale';
            const btnClass = tool.locked ? 'btn-outline-secondary disabled' : 'btn-outline-warning launcher-btn';
            const btnIcon = tool.locked ? 'ph-lock-key' : 'ph-play';
            const btnText = tool.locked ? t('btn.locked') : t('btn.launch');
            
            const title = t(`tools.${tool.id}.title`);
            const desc = t(`tools.${tool.id}.desc`);

            return `
                <div class="col-md-4 col-lg-3">
                    <div class="card bg-[#161616] border border-[#333] h-100 shadow-lg ${opacity} transition-all">
                        <div class="card-body text-center p-4 d-flex flex-col justify-between h-100">
                            <div>
                                <i class="ph ${tool.icon} text-4xl mb-3 ${tool.locked ? 'text-gray-600' : 'text-amber-600'}"></i>
                                <h5 class="card-title medieval-font text-gray-200">${title}</h5>
                                <p class="card-text text-gray-500 text-sm mb-4">${desc}</p>
                            </div>
                            <button class="btn btn-sm ${btnClass} w-100" data-module="${tool.id}">
                                <i class="ph ${btnIcon}"></i> ${btnText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.container.innerHTML = `
            <div class="container-fluid h-100 overflow-y-auto custom-scrollbar py-5 fade-in">
                <div class="container">
                    <!-- Header -->
                    <div class="text-center mb-5">
                        <div class="mb-2"><i class="ph ph-crown text-5xl text-amber-600"></i></div>
                        <h1 class="display-4 medieval-font text-amber-500 mb-2" data-i18n="home.welcome">${t('home.welcome')}</h1>
                        <p class="lead text-gray-400" data-i18n="home.subtitle">${t('home.subtitle')}</p>
                        
                        <div class="mt-4 flex gap-3 justify-center">
                            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#changelogModal">
                                <i class="ph ph-clock-counter-clockwise"></i> <span data-i18n="home.changelog">${t('home.changelog')}</span>
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#roadmapModal">
                                <i class="ph ph-path"></i> <span data-i18n="home.roadmap">${t('home.roadmap')}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tools Grid -->
                    <div class="row g-4 pb-5">
                        ${toolsHTML}
                    </div>
                </div>
            </div>

            ${this.renderChangelogModal()}
            ${this.renderRoadmapModal()}
        `;

        this.container.querySelectorAll('.launcher-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const module = e.target.closest('button').dataset.module;
                window.App.loadModule(module);
            });
        });
    }

    renderChangelogModal() {
        const logs = this.versionData.changelog || [];
        const content = logs.map(log => `
            <div class="mb-4">
                <div class="d-flex justify-content-between text-amber-500 border-bottom border-gray-700 pb-1 mb-2">
                    <span class="font-bold">v${log.version}</span>
                    <span class="text-xs text-gray-500">${log.date}</span>
                </div>
                <ul class="text-gray-300 text-sm ps-3 space-y-1">
                    ${log.changes.map(c => `<li class="list-disc">${c}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        return `
            <div class="modal fade" id="changelogModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content bg-[#111] border border-[#333] text-gray-200">
                        <div class="modal-header border-bottom border-[#333]">
                            <h5 class="modal-title medieval-font text-amber-600">Registro de Cambios</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body custom-scrollbar">${content}</div>
                    </div>
                </div>
            </div>`;
    }

    renderRoadmapModal() {
        const roadmap = this.versionData.roadmap || [];
        const content = roadmap.map(phase => {
            const statusColor = phase.status === 'completado' ? 'text-green-500' : (phase.status === 'en_progreso' ? 'text-amber-500' : 'text-gray-500');
            return `
                <div class="mb-4 bg-[#1a1a1a] p-3 rounded border border-[#333]">
                    <h6 class="medieval-font ${statusColor} mb-2 flex justify-between">
                        ${phase.phase}
                        <i class="ph ${phase.status === 'completado' ? 'ph-check-circle' : 'ph-circle'}"></i>
                    </h6>
                    <div class="d-flex flex-wrap gap-2">
                        ${phase.features.map(f => `<span class="badge bg-[#222] border border-[#444] fw-normal text-gray-300">${f}</span>`).join('')}
                    </div>
                </div>`;
        }).join('');

        return `
            <div class="modal fade" id="roadmapModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-scrollable modal-lg">
                    <div class="modal-content bg-[#111] border border-[#333] text-gray-200">
                        <div class="modal-header border-bottom border-[#333]">
                            <h5 class="modal-title medieval-font text-amber-600">Hoja de Ruta</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body custom-scrollbar">${content}</div>
                    </div>
                </div>
            </div>`;
    }

    destroy() {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style = '';
        this.container.innerHTML = '';
    }
}