import { DataService } from './DataService.js';

export const AIService = {
    async generateText(prompt, type = 'news', model = 'gpt', maxChars = 280) {
        const config = DataService.getGlobal();
        
        // --- PROMPTS ---
        let systemPrompt = "Eres un redactor de un periódico de fantasía medieval para D&D. ";
        
        if (type === 'news') {
            systemPrompt += `Escribe una noticia breve basada en la premisa. Formato estricto: 1ª Línea = Titular. Resto = Cuerpo. Extensión máxima total aproximada: ${maxChars} caracteres. Tono: Épico o sensacionalista.`;
        } else if (type === 'obituary') {
            systemPrompt += `Escribe una esquela solemne. 1ª Línea: Nombre y Título. Resto: Elogio fúnebre poético. Extensión máx: ${maxChars} caracteres.`;
        }

        const fullPrompt = `${systemPrompt}\n\nPremisa: ${prompt}`;

        if (model === 'gemini') {
            return this.callGemini(fullPrompt, config.geminiKey);
        } else {
            return this.callOpenAI(systemPrompt, prompt, config.apiKey, maxChars);
        }
    },

    async callOpenAI(system, user, apiKey, maxChars) {
        if (!apiKey) throw new Error("Falta OpenAI API Key. Configúrala en Ajustes.");
        
        // Estimación de tokens basada en caracteres (aprox 4 chars por token)
        const maxTokens = Math.ceil(maxChars / 3) + 50; 

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", 
                messages: [{ role: "system", content: system }, { role: "user", content: user }],
                temperature: 0.7,
                max_tokens: maxTokens
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.choices[0].message.content;
    },

    async callGemini(prompt, apiKey) {
        if (!apiKey) throw new Error("Falta Gemini API Key. Configúrala en Ajustes.");

        const modelName = "gemini-2.5-flash"; // O usa 'gemini-2.5-flash' si tienes acceso
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(`Gemini Error (${modelName}): ${data.error.message}`);
        }
        
        if (!data.candidates || data.candidates.length === 0) {
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`Gemini bloqueó la respuesta: ${data.promptFeedback.blockReason}`);
            }
            throw new Error("Gemini no devolvió resultados.");
        }
        
        return data.candidates[0].content.parts[0].text;
    },

    parseResponse(text) {
        const lines = text.split('\n');
        let title = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '').trim(); 
        let body = lines.slice(1).join('\n').trim();
        title = title.replace(/^(Titular|Headline):/i, '').trim();
        return { title, body };
    }
};