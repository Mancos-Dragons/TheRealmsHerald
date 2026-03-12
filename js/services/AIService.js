/**
 * @file AIService.js
 * @description Servicio para interactuar con APIs de IA (OpenAI, Gemini, Claude, etc.) compatibles con OpenAI.
 */

import { DataService } from './DataService.js';

export const AIService = {
    /**
     * Verifica si la IA está configurada correctamente
     * @returns {boolean}
     */
    isConfigured() {
        const config = DataService.load('ai_config');
        return config && config.apiKey && config.baseUrl && config.model;
    },

    /**
     * Genera una respuesta usando el proveedor de IA configurado
     * @param {string} systemPrompt - Instrucciones para el sistema
     * @param {string} userPrompt - Prompt del usuario
     * @returns {Promise<string|null>} - Respuesta generada o null si falla
     */
    async generate(systemPrompt, userPrompt) {
        if (!this.isConfigured()) {
            console.warn("AIService: No hay configuración de IA disponible.");
            return null;
        }

        const config = DataService.load('ai_config');

        try {
            const response = await fetch(`${config.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("AIService: Error en la respuesta de la API", errorData);
                return null;
            }

            const data = await response.json();

            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                return data.choices[0].message.content.trim();
            } else {
                console.error("AIService: Respuesta inesperada de la API", data);
                return null;
            }
        } catch (error) {
            console.error("AIService: Error de red o parseo", error);
            return null;
        }
    }
};
