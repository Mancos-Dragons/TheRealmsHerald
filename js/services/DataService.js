/**
 * @file DataService.js
 * @description Gestión de datos locales y configuración global persistente.
 */

export const DataService = {
    GLOBAL_KEY: 'trh_global_config',

    async init() {
        console.log("💾 DataService: Inicializado.");
        // Asegurar que exista la configuración global base
        if (!localStorage.getItem(this.GLOBAL_KEY)) {
            const initialConfig = {
                apiKey: "",      // OpenAI
                geminiKey: "",   // Google Gemini (NUEVO)
                calendarSystem: "gregorian", 
                customStyles: {
                    papers: [], 
                    fonts: []   
                }
            };
            this.saveGlobal(initialConfig);
        }
        return true;
    },

    // --- MÉTODOS GENÉRICOS ---
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Error guardando datos localmente:", e);
            return false;
        }
    },

    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error cargando datos:", e);
            return null;
        }
    },

    // --- MÉTODOS DE CONFIGURACIÓN GLOBAL ---

    getGlobal() {
        return this.load(this.GLOBAL_KEY) || {};
    },

    saveGlobal(config) {
        return this.save(this.GLOBAL_KEY, config);
    },

    addCustomStyle(type, item) {
        const config = this.getGlobal();
        if(!config.customStyles) config.customStyles = { papers: [], fonts: [] };
        config.customStyles[type].push(item);
        this.saveGlobal(config);
    }
};