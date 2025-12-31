import { EventBus } from './core/EventBus.js';
import { DataService } from './services/DataService.js';
import { LanguageService } from './core/LanguageService.js';

class AppOrchestrator {
    constructor() {
        this.currentModule = null;
        this.currentModuleKey = 'home';
        this.container = document.getElementById('app-container');
        
        this.modules = {
            'home': () => import('./modules/home/HomeController.js'),
            'newspaper': () => import('./modules/newspaper/NewspaperController.js'),
        };
        
        this.init();
    }

    async init() {
        console.log("📜 The Realm's Herald: Iniciando sistemas...");
        try {
            await DataService.init();
            
            await LanguageService.loadResources();
            
            this.changeLanguage('es');
            await this.loadModule('home');
            
        } catch (error) {
            console.error("CRITICAL FAILURE:", error);
            this.container.innerHTML = `<div class="alert alert-danger m-5">Error Crítico: ${error.message}</div>`;
        }
    }

    changeLanguage(lang) {
        const changed = LanguageService.setLanguage(lang);
        if(changed) {
            const flagMap = { 'es': 'fi-es', 'en': 'fi-us' };
            const flagEl = document.getElementById('current-lang-flag');
            if(flagEl) {
                flagEl.className = `fi ${flagMap[lang]}`;
            }

            if (this.currentModule) {
                if(this.currentModuleKey === 'newspaper') {
                    this.currentModule.view.renderWorkspace(this.currentModule.model.config);
                    this.currentModule.refreshPaper();
                    this.currentModule.attachEvents(); 
                } else if (this.currentModuleKey === 'home') {
                    this.currentModule.render();
                }
            }
        }
    }

    async loadModule(moduleKey) {
        if (!this.modules[moduleKey]) return;

        if (this.currentModule) {
            try {
                if (typeof this.currentModule.destroy === 'function') {
                    this.currentModule.destroy();
                }
            } catch (destroyError) {
                console.warn("Error limpiando módulo anterior:", destroyError);
            }
            this.currentModule = null;
        }
        
        this.container.innerHTML = '';
        this.currentModuleKey = moduleKey;
        this.updateActiveNav(moduleKey);
        
        this.container.innerHTML = `
            <div class="h-100 d-flex flex-column justify-content-center align-items-center">
                <div class="spinner-border text-warning" role="status"></div>
                <div class="text-secondary mt-2 small">Cargando pergaminos...</div>
            </div>`;

        try {
            const moduleImport = await this.modules[moduleKey]();
            const ModuleClass = moduleImport.default;
            
            this.currentModule = new ModuleClass(this.container);
            await this.currentModule.init();
            
        } catch (error) {
            console.error(`Error cargando módulo ${moduleKey}:`, error);
            this.container.innerHTML = `<div class="text-danger p-4">Error cargando el módulo: ${error.message}</div>`;
        }
    }

    updateActiveNav(key) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active', 'text-warning');
            if(link.getAttribute('onclick') && link.getAttribute('onclick').includes(key)) {
                link.classList.add('active', 'text-warning');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.App = new AppOrchestrator();
});