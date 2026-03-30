import { DataService } from '../../services/DataService.js';

export default class DocumentsModel {
    constructor() {
        this.config = {
            type: 'decree',
            title: '',
            body: '',
            signature: '',
            seal: 'ph-crown',
            texture: 'texture-clean',
            font: 'font-royal',
            customTexture: '',
            customFont: '',
            customSeal: ''
        };
        this.STORAGE_KEY = 'trh_documents_data';
    }

    async load() {
        const data = await DataService.load(this.STORAGE_KEY);
        if (data && data.config) {
            this.config = { ...this.config, ...data.config };
        }
    }

    save() {
        DataService.save(this.STORAGE_KEY, {
            config: this.config
        });
    }

    getConfig() {
        return this.config;
    }

    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.save();
    }
}