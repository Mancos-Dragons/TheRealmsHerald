import { DataService } from '../../services/DataService.js';

export default class CampaignsModel {
    constructor() {
        this.keysToExport = [
            'trh_newspaper_data',
            'trh_documents_data',
            'trh_global_config',
            'ai_config',
            'trh_campaign_journal'
        ];
        this.JOURNAL_KEY = 'trh_campaign_journal';
    }

    addJournalEntry(entry) {
        let journal = DataService.load(this.JOURNAL_KEY) || [];
        journal.push({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...entry
        });
        DataService.save(this.JOURNAL_KEY, journal);
    }

    getJournal() {
        return DataService.load(this.JOURNAL_KEY) || [];
    }

    exportCampaign() {
        const campaignData = {};
        for (const key of this.keysToExport) {
            const data = DataService.load(key);
            if (data) {
                campaignData[key] = data;
            }
        }

        return {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            data: campaignData
        };
    }

    importCampaign(campaignObject) {
        if (!campaignObject || !campaignObject.data) {
            return false;
        }

        const dataToImport = campaignObject.data;

        for (const key of this.keysToExport) {
            if (dataToImport.hasOwnProperty(key)) {
                DataService.save(key, dataToImport[key]);
            } else {
                DataService.remove(key);
            }
        }

        return true;
    }
}
