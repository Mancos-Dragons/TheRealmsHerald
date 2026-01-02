/**
 * @file NewspaperModel.js
 * @description Gestión de datos v0.8.3 (Fix Special Replacement & Delete)
 */
import { DataService } from '../../services/DataService.js';

export default class NewspaperModel {
    constructor() {
        this.itemsByPage = { 1: [] }; 
        
        this.config = {
            name: "La Voz del Conejo",
            price: "2 Cobres", 
            subtitle: "Edición Real Primaria",
            texture: "texture-clean",
            fontTheme: "font-royal",
            baseDate: new Date().toISOString().split('T')[0],
            currentDate: new Date().toISOString().split('T')[0],
            frequency: 7,
            manualEdition: 0
        };
        
        this.STORAGE_KEY = 'trh_newspaper_data';
    }

    async load() {
        const data = await DataService.load(this.STORAGE_KEY);
        if (data) {
            if (data.items) this.itemsByPage = data.items;
            if (data.config) this.config = { ...this.config, ...data.config };
        }
    }

    save() {
        DataService.save(this.STORAGE_KEY, {
            items: this.itemsByPage,
            config: this.config
        });
    }

    getEditionNumber() {
        if (this.config.manualEdition > 0) return this.config.manualEdition;
        const start = new Date(this.config.baseDate);
        const current = new Date(this.config.currentDate);
        const diffTime = Math.abs(current - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const freq = parseInt(this.config.frequency) || 7;
        return Math.floor(diffDays / freq) + 1;
    }

    getLastActivePage() {
        const pages = Object.keys(this.itemsByPage).map(Number);
        if (pages.length === 0) return 1;
        const activePages = pages.filter(p => this.itemsByPage[p] && this.itemsByPage[p].length > 0);
        if (activePages.length === 0) return 1;
        return Math.max(...activePages);
    }

    addNewsItem(page, item) {
        if (!item.id) item.id = Date.now().toString();
        if (!this.itemsByPage[page]) this.itemsByPage[page] = [];
        this.itemsByPage[page].push(item);
        this.save();
    }

    /**
     * Añade item especial.
     * CORRECCIÓN: Detecta si ya hay un especial para reemplazarlo en lugar de desplazarlo.
     */
    addSpecialItem(item) {
        if (!item.id) item.id = Date.now().toString();
        item.type = 'special'; 
        item.size = 'span-12'; 

        const page1Items = this.itemsByPage[1] || [];
        
        const isReplacingSpecial = page1Items.length > 0 && page1Items[0].type === 'special';

        if (isReplacingSpecial) {
            this.itemsByPage[1] = [item];
        } else {
            if (page1Items.length > 0) {
                const maxPage = this.getLastActivePage();
                for (let i = maxPage; i >= 1; i--) {
                    const contentToMove = this.itemsByPage[i];
                    if (contentToMove && contentToMove.length > 0) {
                        if (!this.itemsByPage[i + 1]) this.itemsByPage[i + 1] = [];
                        this.itemsByPage[i + 1] = [...contentToMove, ...this.itemsByPage[i + 1]];
                        this.itemsByPage[i] = []; 
                    }
                }
            }
            this.itemsByPage[1] = [item];
        }
        
        this.save();
    }

    moveItem(fromPage, toPage, itemId, newIndex = null) {
        if (!this.itemsByPage[fromPage]) return;
        const index = this.itemsByPage[fromPage].findIndex(i => i.id === itemId);
        if (index === -1) return;
        
        const [item] = this.itemsByPage[fromPage].splice(index, 1);
        
        if (!this.itemsByPage[toPage]) this.itemsByPage[toPage] = [];
        
        if (newIndex !== null && newIndex !== undefined && newIndex >= 0) {
            this.itemsByPage[toPage].splice(newIndex, 0, item);
        } else {
            this.itemsByPage[toPage].push(item);
        }
        
        this.save();
    }

    deleteNewsItem(page, id) {
        if (!this.itemsByPage[page]) return;
        this.itemsByPage[page] = this.itemsByPage[page].filter(i => i.id !== id);
        this.save();
    }

    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.save();
    }
    
    getItems(page) {
        return this.itemsByPage[page] || [];
    }

    toJSON() {
        return JSON.stringify({
            meta: { version: "0.8.3", app: "The Realm's Herald" },
            config: this.config,
            items: this.itemsByPage
        }, null, 2);
    }

    fromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.config) this.config = data.config;
            if (data.items) this.itemsByPage = data.items;
            this.save();
            return true;
        } catch (e) {
            console.error("Error importando JSON", e);
            return false;
        }
    }
}