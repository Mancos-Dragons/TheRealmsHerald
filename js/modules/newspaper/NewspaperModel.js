/**
 * @file NewspaperModel.js
 * @description Gestiona el estado y los datos del periódico.
 */
import { DataService } from '../../services/DataService.js';

export default class NewspaperModel {
    constructor() {
        this.itemsByPage = { 1: [], 2: [], 3: [], 4: [] };
        this.config = {
            name: "La Voz del Conejo",
            price: "2 Cobres",
            year: "1492 CV",
            subtitle: "Edición Real Primaria"
        };
        this.STORAGE_KEY = 'trh_newspaper_data';
    }

    async load() {
        const data = await DataService.load(this.STORAGE_KEY);
        if (data) {
            if (data.items) this.itemsByPage = data.items;
            if (data.config) this.config = data.config;
        }
    }

    save() {
        DataService.save(this.STORAGE_KEY, {
            items: this.itemsByPage,
            config: this.config
        });
    }

    addNewsItem(page, item) {
        if (!item.id) item.id = Date.now().toString();
        this.itemsByPage[page].push(item);
        this.save();
    }

    updateNewsItem(page, id, updatedItem) {
        const index = this.itemsByPage[page].findIndex(i => i.id === id);
        if (index !== -1) {
            this.itemsByPage[page][index] = { ...this.itemsByPage[page][index], ...updatedItem };
            this.save();
        }
    }

    deleteNewsItem(page, id) {
        this.itemsByPage[page] = this.itemsByPage[page].filter(i => i.id !== id);
        this.save();
    }

    moveItem(fromPage, toPage, itemId, newIndex) {
        const itemIndex = this.itemsByPage[fromPage].findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;
        
        const [item] = this.itemsByPage[fromPage].splice(itemIndex, 1);
        
        if (newIndex !== undefined && newIndex !== null) {
            this.itemsByPage[toPage].splice(newIndex, 0, item);
        } else {
            this.itemsByPage[toPage].push(item);
        }
        this.save();
    }

    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.save();
    }
    
    getItems(page) {
        return this.itemsByPage[page] || [];
    }
}