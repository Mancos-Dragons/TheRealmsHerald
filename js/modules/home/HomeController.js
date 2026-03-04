import { LanguageService } from '../../core/LanguageService.js';
import { DataService } from '../../services/DataService.js';

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
        const globalConfig = DataService.getGlobal();
        
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
                </div>`;
        }).join('');

        this.container.innerHTML = `
            <div class="container-fluid h-100 overflow-y-auto custom-scrollbar py-5 fade-in">
                <div class="container">
                    <div class="text-center mb-5">
                        <div class="mb-2"><i class="ph ph-crown text-5xl text-amber-600"></i></div>
                        <h1 class="display-4 medieval-font text-amber-500 mb-2" data-i18n="home.welcome">${t('home.welcome')}</h1>
                        <p class="lead text-gray-400" data-i18n="home.subtitle">${t('home.subtitle')}</p>
                        
                        <div class="mt-4 flex gap-3 justify-center">
                            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#changelogModal">
                                <i class="ph ph-clock-counter-clockwise"></i> <span data-i18n="home.changelog">${t('home.changelog')}</span>
                            </button>
                            <!-- BOTÓN SETTINGS -->
                            <button class="btn btn-sm btn-outline-warning" data-bs-toggle="modal" data-bs-target="#settingsModal">
                                <i class="ph ph-gear"></i> <span data-i18n="home.settings">${t('home.settings')}</span>
                            </button>
                        </div>
                    </div>
                    <div class="row g-4 pb-5">${toolsHTML}</div>
                </div>
            </div>

            <!-- Modales -->
            ${this.renderChangelogModal()}
            ${this.renderSettingsModal(globalConfig)}
        `;

        this.attachEvents();
    }

    renderSettingsModal(config) {
        const t = (key) => LanguageService.get(key);
        return `
            <div class="modal fade" id="settingsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content bg-[#111] border border-[#333] text-gray-200">
                        <div class="modal-header border-bottom border-[#333]">
                            <h5 class="modal-title medieval-font text-amber-600" data-i18n="settings.global.title">${t('settings.global.title')}</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body custom-scrollbar p-4 space-y-4">
                            <!-- API KEYS -->
                            <div class="bg-[#1a1a1a] p-3 rounded border border-purple-900/30">
                                <h6 class="text-purple-400 font-bold text-sm mb-2"><i class="ph ph-brain"></i> Inteligencia Artificial</h6>
                                
                                <div class="mb-3">
                                    <label class="text-xs text-gray-400 block mb-1" data-i18n="settings.api.key">${t('settings.api.key')}</label>
                                    <input type="password" id="global-api-key" class="w-full bg-[#111] border border-gray-700 text-gray-100 p-2 rounded" value="${config?.apiKey || ''}" placeholder="sk-...">
                                </div>

                                <div>
                                    <label class="text-xs text-gray-400 block mb-1">Gemini API Key (Google)</label>
                                    <input type="password" id="global-gemini-key" class="w-full bg-[#111] border border-gray-700 text-gray-100 p-2 rounded" value="${config?.geminiKey || ''}" placeholder="AIza...">
                                </div>
                                
                                <p class="text-[10px] text-gray-500 mt-2">Las claves se guardan localmente en tu navegador.</p>
                            </div>
                            
                            <!-- CALENDARIO -->
                            <div>
                                <label class="text-xs text-amber-500 font-bold uppercase mb-1" data-i18n="settings.calendar">${t('settings.calendar')}</label>
                                <select id="global-calendar" class="w-full bg-[#1c1c1c] border border-gray-700 text-gray-100 p-2 rounded">
                                    <option value="gregorian" ${config?.calendarSystem==='gregorian'?'selected':''} data-i18n="settings.cal.gregorian">${t('settings.cal.gregorian')}</option>
                                    <option value="harptos" ${config?.calendarSystem==='harptos'?'selected':''} data-i18n="settings.cal.harptos">${t('settings.cal.harptos')}</option>
                                    <option value="imperial" ${config?.calendarSystem==='imperial'?'selected':''} data-i18n="settings.cal.imperial">${t('settings.cal.imperial')}</option>
                                </select>
                            </div>

                            <!-- CUSTOM ASSETS -->
                            <div class="border-t border-gray-800 pt-4 mt-4">
                                <h6 class="text-amber-500 font-bold mb-3" data-i18n="settings.custom.assets">${t('settings.custom.assets')}</h6>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <!-- PAPEL -->
                                    <div>
                                        <label class="text-xs text-gray-400 font-bold mb-1" data-i18n="settings.upload.paper">${t('settings.upload.paper')}</label>
                                        <div class="flex gap-2">
                                            <input type="text" id="custom-paper-name" class="w-1/2 bg-[#1c1c1c] border border-gray-700 text-gray-100 p-1 rounded text-xs" placeholder="Nombre">
                                            <label class="cursor-pointer bg-[#222] border border-gray-700 text-gray-400 hover:text-white px-2 py-1 rounded flex items-center justify-center flex-1">
                                                <i class="ph ph-upload-simple"></i>
                                                <input type="file" id="file-custom-paper" class="hidden" accept="image/*">
                                            </label>
                                        </div>
                                    </div>
                                    <!-- FUENTE -->
                                    <div>
                                        <label class="text-xs text-gray-400 font-bold mb-1" data-i18n="settings.upload.font">${t('settings.upload.font')}</label>
                                        <div class="flex gap-2">
                                            <input type="text" id="custom-font-name" class="w-1/2 bg-[#1c1c1c] border border-gray-700 text-gray-100 p-1 rounded text-xs" placeholder="Nombre">
                                            <label class="cursor-pointer bg-[#222] border border-gray-700 text-gray-400 hover:text-white px-2 py-1 rounded flex items-center justify-center flex-1">
                                                <i class="ph ph-text-t"></i>
                                                <input type="file" id="file-custom-font" class="hidden" accept=".ttf,.woff,.woff2">
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div id="custom-assets-status" class="text-xs text-green-500 mt-2 h-4"></div>
                            </div>
                        </div>
                        <div class="modal-footer border-top border-[#333]">
                            <button type="button" class="btn btn-warning" id="btn-save-global" data-i18n="btn.save.global">${t('btn.save.global')}</button>
                        </div>
                    </div>
                </div>
            </div>`;
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

    attachEvents() {
        this.container.querySelectorAll('.launcher-btn').forEach(btn => {
            btn.addEventListener('click', (e) => window.App.loadModule(e.target.closest('button').dataset.module));
        });

        const btnSave = document.getElementById('btn-save-global');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const config = DataService.getGlobal();
                config.apiKey = document.getElementById('global-api-key').value;
                config.geminiKey = document.getElementById('global-gemini-key').value; // NUEVO
                config.calendarSystem = document.getElementById('global-calendar').value;
                DataService.saveGlobal(config);
                const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
                modal.hide();
                alert("Configuración global guardada.");
            });
        }

        const filePaper = document.getElementById('file-custom-paper');
        if (filePaper) filePaper.addEventListener('change', (e) => this.handleCustomUpload(e, 'papers'));

        const fileFont = document.getElementById('file-custom-font');
        if (fileFont) fileFont.addEventListener('change', (e) => this.handleCustomUpload(e, 'fonts'));
    }

    handleCustomUpload(e, type) {
        const file = e.target.files[0];
        if (!file) return;
        const nameInput = type === 'papers' ? 'custom-paper-name' : 'custom-font-name';
        const name = document.getElementById(nameInput).value || file.name.split('.')[0];
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            DataService.addCustomStyle(type, { name, url: evt.target.result });
            document.getElementById('custom-assets-status').innerText = `¡${name} añadido!`;
            setTimeout(() => document.getElementById('custom-assets-status').innerText = '', 3000);
        };
        reader.readAsDataURL(file);
    }

    destroy() {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        this.container.innerHTML = '';
    }
}