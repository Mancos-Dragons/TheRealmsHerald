import { LanguageService } from '../../core/LanguageService.js';

export default class CampaignsView {
    constructor(container) {
        this.container = container;
    }

    render() {
        const t = (key) => LanguageService.get(key);

        this.container.innerHTML = `
            <div class="container-fluid h-100 overflow-y-auto custom-scrollbar p-0">
                <div class="d-flex flex-column h-100">
                    <!-- HEADER -->
                    <div class="bg-dark border-bottom border-secondary p-3 shrink-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <h2 class="medieval-font text-warning m-0">
                                <i class="ph ph-books"></i> <span data-i18n="campaigns.title">${t('campaigns.title')}</span>
                            </h2>
                        </div>
                        <p class="text-secondary mb-0 mt-2 small" data-i18n="campaigns.subtitle">${t('campaigns.subtitle')}</p>
                    </div>

                    <!-- WORKSPACE -->
                    <div class="flex-grow-1 p-4 d-flex justify-content-center align-items-center bg-[#1a1a1a]">
                        <div class="card bg-[#222] border-secondary" style="max-width: 600px; width: 100%;">
                            <div class="card-body p-5 text-center">
                                <h3 class="medieval-font text-warning mb-4"><span data-i18n="campaigns.actions.title">${t('campaigns.actions.title')}</span></h3>

                                <div class="d-flex flex-column gap-3">
                                    <button id="btn-export-campaign" class="btn btn-outline-warning btn-lg d-flex justify-content-center align-items-center gap-2">
                                        <i class="ph ph-download-simple"></i> <span data-i18n="campaigns.export">${t('campaigns.export')}</span>
                                    </button>

                                    <hr class="border-secondary my-3">

                                    <label class="btn btn-outline-secondary btn-lg d-flex justify-content-center align-items-center gap-2 cursor-pointer mb-0">
                                        <i class="ph ph-upload-simple"></i> <span data-i18n="campaigns.import">${t('campaigns.import')}</span>
                                        <input type="file" id="input-import-campaign" accept=".json" class="d-none">
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
