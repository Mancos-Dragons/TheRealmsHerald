/**
 * @file LanguageService.js
 * @description Gestión de i18n con carga de JSON externo.
 */

export const LanguageService = {
    currentLang: 'es',
    
    dictionary: {
        es: {
            "app.title": "The Realm's Herald",
            "nav.home": "Inicio",
            "nav.newspaper": "Prensa",
            "nav.rumors": "Rumores",
            "btn.launch": "Iniciar",
            "btn.locked": "Bloqueado",
            "home.welcome": "Bienvenido, Arquitecto",
            "home.subtitle": "Selecciona una herramienta para forjar tu mundo.",
            "home.changelog": "Historial",
            "home.roadmap": "Futuro",
            "home.ai_config": "Configuración de IA",
            "home.ai_config.desc": "Configura tu conexión a un proveedor de IA (OpenAI, Anthropic, Gemini, etc.) mediante una API compatible. Esto potenciará herramientas como la generación de rumores.",
            "home.ai_config.baseUrl": "URL Base (Ej: https://api.openai.com/v1)",
            "home.ai_config.apiKey": "Clave API (API Key)",
            "home.ai_config.model": "Modelo (Ej: gpt-4o-mini)",
            "home.ai_config.cancel": "Cancelar",
            "home.ai_config.save": "Guardar",
            "home.ai_config.saved": "Configuración de IA guardada con éxito.",
            "nav.documents": "Documentos",
            "docs.editor.title": "Editor Real",
            "docs.type": "Tipo de Documento",
            "docs.type.decree": "Decreto",
            "docs.type.letter": "Carta",
            "docs.title": "Título / Encabezado",
            "docs.body": "Cuerpo del texto",
            "docs.signature": "Firma",
            "docs.seal": "Sello (Icono)",
            "docs.texture": "Textura del papel",
            "docs.texture.clean": "Pergamino Real",
            "docs.texture.gritty": "Panfleto Sucio",
            "docs.font": "Tipografía",
            "docs.font.royal": "Corte Real",
            "docs.font.script": "Manuscrito",
            "docs.btn.pdf": "Exportar PDF",
            "rumors.title": "Susurros de Taberna",
            "rumors.desc": "Generador de chismes y rumores procedurales para Dungeon Masters.",
            "rumors.variables": "Variables Iniciales",
            "rumors.town": "Nombre del Pueblo / Ciudad",
            "rumors.town.placeholder": "Ej: Vado Verde",
            "rumors.npc": "Nombre del Personaje",
            "rumors.npc.placeholder": "Ej: Silas",
            "rumors.role": "Rol o Profesión",
            "rumors.role.placeholder": "Ej: Herrero",
            "rumors.generate": "Generar Rumor",
            "rumors.generating": "Generando...",
            "rumors.result.title": "El Rumor",
            "rumors.result.hook": "Notas del DM",
            "rumors.fallback": "Generación procedural...",
            "news.editor.title": "Editor de Prensa",
            "news.type": "Tipo",
            "news.type.news": "Noticia",
            "news.type.ad": "Publicidad",
            "news.type.special": "Especial (Portada)",
            "news.special.format": "Tipo de Documento",
            "news.special.wanted": "Se Busca (Wanted)",
            "news.special.decree": "Decreto Oficial",
            "news.special.reward": "Recompensa / Firma",
            "news.special.seal": "Símbolo Sello (Texto/Icono)",
            "news.special.seal.img": "Imagen Sello (URL/Vector)", 
            "news.special.wanted.title": "SE BUSCA",
            
            "lbl.wanted.name": "Nombre del Fugitivo",
            "lbl.wanted.desc": "Crímenes / Descripción",
            "lbl.wanted.reward": "Recompensa",
            "lbl.wanted.image": "Retrato del Fugitivo (URL)",
            
            "lbl.decree.title": "Título de la Ley",
            "lbl.decree.body": "Texto del Decreto",
            "lbl.decree.auth": "Firma / Autoridad",
            "lbl.decree.seal": "Sello (Icono o Texto)",
            "lbl.decree.image": "Imagen Decorativa (Opcional)",

            "news.ai.title": "Generador IA",
            "news.ai.town": "Pueblo / Ciudad",
            "news.ai.town.placeholder": "Ej: Aguas Profundas",
            "news.ai.character": "Personaje",
            "news.ai.character.placeholder": "Ej: Elminster",
            "news.ai.type": "Tipo de contenido",
            "news.ai.type.rumor": "Rumor general",
            "news.ai.type.event": "Evento importante",
            "news.ai.type.scandal": "Escándalo / Crimen",
            "news.ai.type.obituary": "Esquela fúnebre",
            "news.ai.type.ad": "Anuncio publicitario",
            "news.ai.generate": "Redactar con IA",

            "news.headline": "Titular",
            "news.headline.placeholder": "Título principal...",
            "news.size": "Tamaño",
            "news.size.cover": "★ Portada",
            "news.size.feat": "Destacada",
            "news.size.std": "Estándar",
            "news.size.col": "Columna",
            "news.size.brief": "Breve",
            "news.ad.format": "Formato",
            "news.ad.box.s": "Caja Pequeña",
            "news.ad.box.m": "Caja Media",
            "news.ad.box.l": "Caja Grande",
            "news.ad.banner": "Zócalo",
            "news.page": "Página",
            "news.image": "Imagen (URL)",
            "news.body": "Contenido",
            "news.body.placeholder": "Escribe aquí...",
            "news.btn.add": "Añadir",
            "news.btn.save_edit": "Guardar",
            "news.btn.new": "Nuevo",
            "news.btn.load": "Cargar",
            "news.btn.save": "Guardar",
            "news.btn.pdf": "PDF",
            "news.settings.title": "Ajustes",
            "conf.identity": "Identidad",
            "conf.name": "Nombre",
            "conf.sub": "Subtítulo",
            "conf.price": "Precio",
            "conf.aesthetics": "Estética",
            "conf.paper": "Papel",
            "conf.font": "Tipografía",
            "conf.chrono": "Cronología",
            "conf.date.base": "Inicio Campaña",
            "conf.date.curr": "Fecha Actual",
            "conf.freq": "Frecuencia",
            "conf.manual": "Ed. Manual",
            "btn.save": "Guardar Ajustes"
        },
        en: {
            "app.title": "The Realm's Herald",
            "nav.home": "Home",
            "nav.newspaper": "Newspaper",
            "nav.rumors": "Rumors",
            "btn.launch": "Launch",
            "btn.locked": "Locked",
            "home.welcome": "Welcome, Architect",
            "home.subtitle": "Select a tool to forge your world.",
            "home.changelog": "History",
            "home.roadmap": "Roadmap",
            "home.ai_config": "AI Configuration",
            "home.ai_config.desc": "Configure your connection to an AI provider (OpenAI, Anthropic, Gemini, etc.) using a compatible API. This will power tools like rumor generation.",
            "home.ai_config.baseUrl": "Base URL (e.g. https://api.openai.com/v1)",
            "home.ai_config.apiKey": "API Key",
            "home.ai_config.model": "Model (e.g. gpt-4o-mini)",
            "home.ai_config.cancel": "Cancel",
            "home.ai_config.save": "Save",
            "home.ai_config.saved": "AI configuration saved successfully.",
            "nav.documents": "Documents",
            "docs.editor.title": "Royal Editor",
            "docs.type": "Document Type",
            "docs.type.decree": "Decree",
            "docs.type.letter": "Letter",
            "docs.title": "Title / Header",
            "docs.body": "Body Text",
            "docs.signature": "Signature",
            "docs.seal": "Seal (Icon)",
            "docs.texture": "Paper Texture",
            "docs.texture.clean": "Royal Parchment",
            "docs.texture.gritty": "Gritty Pamphlet",
            "docs.font": "Typography",
            "docs.font.royal": "Royal Court",
            "docs.font.script": "Manuscript",
            "docs.btn.pdf": "Export PDF",
            "rumors.title": "Tavern Whispers",
            "rumors.desc": "Procedural gossip and rumor generator for Dungeon Masters.",
            "rumors.variables": "Initial Variables",
            "rumors.town": "Town / City Name",
            "rumors.town.placeholder": "e.g. Greenford",
            "rumors.npc": "Character Name",
            "rumors.npc.placeholder": "e.g. Silas",
            "rumors.role": "Role or Profession",
            "rumors.role.placeholder": "e.g. Blacksmith",
            "rumors.generate": "Generate Rumor",
            "rumors.generating": "Generating...",
            "rumors.result.title": "The Rumor",
            "rumors.result.hook": "DM Notes",
            "rumors.fallback": "Procedural generation...",
            "news.editor.title": "Newspaper Editor",
            "news.type": "Type",
            "news.type.news": "News",
            "news.type.ad": "Ad",
            "news.type.special": "Special (Cover)",
            "news.special.format": "Document Type",
            "news.special.wanted": "Wanted Poster",
            "news.special.decree": "Official Decree",
            "news.special.reward": "Reward / Signature",
            "news.special.seal": "Seal Symbol (Text/Icon)",
            "news.special.seal.img": "Seal Image (URL/Vector)", 
            "news.special.wanted.title": "WANTED",
            
            "lbl.wanted.name": "Fugitive Name",
            "lbl.wanted.desc": "Crimes / Description",
            "lbl.wanted.reward": "Reward",
            "lbl.wanted.image": "Fugitive Portrait (URL)",
            
            "lbl.decree.title": "Decree Title",
            "lbl.decree.body": "Decree Text",
            "lbl.decree.auth": "Signature / Authority",
            "lbl.decree.seal": "Seal (Icon or Text)",
            "lbl.decree.image": "Decorative Image (Optional)",

            "news.ai.title": "AI Generator",
            "news.ai.town": "Town / City",
            "news.ai.town.placeholder": "Ex: Waterdeep",
            "news.ai.character": "Character",
            "news.ai.character.placeholder": "Ex: Elminster",
            "news.ai.type": "Content Type",
            "news.ai.type.rumor": "General Rumor",
            "news.ai.type.event": "Major Event",
            "news.ai.type.scandal": "Scandal / Crime",
            "news.ai.type.obituary": "Obituary",
            "news.ai.type.ad": "Advertisement",
            "news.ai.generate": "Draft with AI",

            "news.headline": "Headline",
            "news.headline.placeholder": "Main title...",
            "news.size": "Size",
            "news.size.cover": "★ Cover",
            "news.size.feat": "Featured",
            "news.size.std": "Standard",
            "news.size.col": "Column",
            "news.size.brief": "Brief",
            "news.ad.format": "Format",
            "news.ad.box.s": "Small Box",
            "news.ad.box.m": "Medium Box",
            "news.ad.box.l": "Large Box",
            "news.ad.banner": "Banner",
            "news.page": "Page",
            "news.image": "Image (URL)",
            "news.body": "Content",
            "news.body.placeholder": "Write here...",
            "news.btn.add": "Add",
            "news.btn.save_edit": "Save",
            "news.btn.new": "New",
            "news.btn.load": "Load",
            "news.btn.save": "Save",
            "news.btn.pdf": "PDF",
            "news.settings.title": "Settings",
            "conf.identity": "Identity",
            "conf.name": "Name",
            "conf.sub": "Subtitle",
            "conf.price": "Price",
            "conf.aesthetics": "Aesthetics",
            "conf.paper": "Paper",
            "conf.font": "Typography",
            "conf.chrono": "Chronology",
            "conf.date.base": "Campaign Start",
            "conf.date.curr": "Current Date",
            "conf.freq": "Frequency",
            "conf.manual": "Manual Ed.",
            "btn.save": "Save Settings"
        }
    },

    async loadResources() {
        try {
            const response = await fetch('./data/locales.json');
            const externalData = await response.json();
            
            for (const lang in externalData) {
                if (!this.dictionary[lang]) this.dictionary[lang] = {};
                if (externalData[lang].tools) {
                    for (const toolKey in externalData[lang].tools) {
                        const tool = externalData[lang].tools[toolKey];
                        this.dictionary[lang][`tools.${toolKey}.title`] = tool.title;
                        this.dictionary[lang][`tools.${toolKey}.desc`] = tool.desc;
                    }
                }
            }
            console.log("🌍 Idiomas externos cargados.");
        } catch (e) {
            console.warn("No se pudieron cargar locales externos, usando defaults.", e);
        }
    },

    setLanguage(lang) {
        if (this.dictionary[lang]) {
            this.currentLang = lang;
            this.translateDOM();
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
            return true;
        }
        return false;
    },

    get(key) {
        return this.dictionary[this.currentLang][key] || key;
    },

    translateDOM() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = this.get(key);
            } else {
                el.innerText = this.get(key);
            }
        });
    }
};