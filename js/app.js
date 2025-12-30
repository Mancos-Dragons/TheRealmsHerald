/**
 * @file app.js
 * @description Orquestador Central de The Realm's Herald.
 * Actúa como Router y Gestor de Estado Global.
 * @author The Realm's Herald
 */

import { EventBus } from './core/EventBus.js';
import { DataService } from './services/DataService.js';

class AppOrchestrator {
    constructor() {
        this.currentModule = null;
        this.modules = {
            'newspaper': () => import('./modules/newspaper/NewspaperController.js'),
            'rumors': () => import('./modules/rumors/RumorsController.js'),
        };
        
        this.init();
    }

    async init() {
        console.log("📜 The Realm's Herald: Inicializando sistemas...");
        
        await DataService.init();

        this.renderNavigation();

        this.loadModule('newspaper'); 
        
        EventBus.on('GLOBAL_ERROR', (msg) => console.error(msg));
    }

    renderNavigation() {
        const navContainer = document.getElementById('main-nav');
    }

    /**
     * Carga dinámica de módulos (Lazy Loading)
     * Descarga el módulo anterior y monta el nuevo.
     * @param {string} moduleKey - Clave del módulo a cargar
     */
    async loadModule(moduleKey) {
        if (!this.modules[moduleKey]) {
            console.error(`Módulo ${moduleKey} no encontrado.`);
            return;
        }

        if (this.currentModule && typeof this.currentModule.destroy === 'function') {
            this.currentModule.destroy();
        }

        const appContainer = document.getElementById('app-container');
        appContainer.innerHTML = '<div class="loader">Cargando pergaminos...</div>';

        try {
            const moduleImport = await this.modules[moduleKey]();
            const ModuleController = moduleImport.default;

            this.currentModule = new ModuleController(appContainer);
            await this.currentModule.init();
            
            console.log(`🏰 Módulo cargado: ${moduleKey}`);

        } catch (error) {
            console.error(`Error cargando el módulo ${moduleKey}:`, error);
            appContainer.innerHTML = '<div class="error">El escriba no pudo encontrar ese documento.</div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.App = new AppOrchestrator();
});