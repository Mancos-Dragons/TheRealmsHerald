/**
 * @file DOMHelper.js
 * @description Utilidades para la manipulación del DOM y seguridad.
 */

export const DOMHelper = {
    escapeHTML(str) {
        if (!str) return '';
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }
};
