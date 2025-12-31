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
            "btn.launch": "Iniciar",
            "btn.locked": "Bloqueado",
            "home.welcome": "Bienvenido, Arquitecto",
            "home.subtitle": "Selecciona una herramienta para forjar tu mundo.",
            "home.changelog": "Historial",
            "home.roadmap": "Futuro",
            "news.editor.title": "Editor de Prensa",
            "news.type": "Tipo",
            "news.type.news": "Noticia",
            "news.type.ad": "Publicidad",
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
            "btn.launch": "Launch",
            "btn.locked": "Locked",
            "home.welcome": "Welcome, Architect",
            "home.subtitle": "Select a tool to forge your world.",
            "home.changelog": "History",
            "home.roadmap": "Roadmap",
            "news.editor.title": "Newspaper Editor",
            "news.type": "Type",
            "news.type.news": "News",
            "news.type.ad": "Ad",
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

    /**
     * Carga el JSON externo y lo fusiona
     */
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