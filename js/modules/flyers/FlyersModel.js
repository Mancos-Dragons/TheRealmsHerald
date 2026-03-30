export default class FlyersModel {
    constructor() {
        this.config = {
            texture: 'texture-clean',
            filter: 'none'
        };
        this.elements = [];
    }

    addElement(type, data) {
        const newElement = {
            id: 'flyer-el-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            type: type, // 'text' or 'image'
            x: 50,
            y: 50,
            scale: 1, // Default scale multiplier
            ...data
        };
        this.elements.push(newElement);
        return newElement;
    }

    updateElement(id, updates) {
        const index = this.elements.findIndex(el => el.id === id);
        if (index !== -1) {
            this.elements[index] = { ...this.elements[index], ...updates };
        }
    }

    removeElement(id) {
        this.elements = this.elements.filter(el => el.id !== id);
    }

    setConfig(configUpdates) {
        this.config = { ...this.config, ...configUpdates };
    }

    getConfig() {
        return this.config;
    }

    getElements() {
        return this.elements;
    }
}
