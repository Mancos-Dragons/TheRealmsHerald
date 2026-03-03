/**
 * @file DOMHelper.js
 * @description Funciones de utilidad para la manipulación segura del DOM.
 */

export const DOMHelper = {
    /**
     * Escapa caracteres especiales de HTML para prevenir XSS.
     * @param {string} str - La cadena a escapar.
     * @returns {string} - La cadena escapada.
     */
    escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
};
