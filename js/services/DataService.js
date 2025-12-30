/**
 * @file DataService.js
 * @description Capa de abstracción para manejo de datos (LocalStorage / JSON).
 */

export const DataService = {
    async init() {
        console.log("💾 DataService: Conectando con los archivos del reino...");
        return true;
    },

    /**
     * Guarda datos en LocalStorage
     * @param {string} key 
     * @param {object} data 
     */
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`💾 Guardado exitoso: ${key}`);
        } catch (e) {
            console.error("Error guardando datos", e);
        }
    },

    /**
     * Carga datos de LocalStorage
     * @param {string} key 
     */
    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};