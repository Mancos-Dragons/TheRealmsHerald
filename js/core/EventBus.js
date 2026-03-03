/**
 * @file EventBus.js
 * @description Sistema de publicación/suscripción para comunicación desacoplada.
 * Permite que "Rumores" reaccione a cambios en "Facciones" sin importarse mutuamente.
 */

export class EventBusImpl {
    constructor() {
        this.events = {};
    }

    /**
     * Suscribirse a un evento
     * @param {string} eventName 
     * @param {function} callback 
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * Desuscribirse (Importante para evitar memory leaks al cambiar de módulo)
     * @param {string} eventName 
     * @param {function} callback 
     */
    off(eventName, callback) {
        if (!this.events[eventName]) return;
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    /**
     * Emitir un evento
     * @param {string} eventName 
     * @param {any} data 
     */
    emit(eventName, data) {
        if (!this.events[eventName]) return;
        this.events[eventName].forEach(callback => callback(data));
    }
}

export const EventBus = new EventBusImpl();