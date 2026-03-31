import CampaignsModel from './CampaignsModel.js';
import CampaignsView from './CampaignsView.js';

export default class CampaignsController {
    constructor(container) {
        this.container = container;
        this.model = new CampaignsModel();
        this.view = new CampaignsView(container);
    }

    async init() {
        this.view.render();
        this.attachEvents();
    }

    attachEvents() {
        const btnExport = this.container.querySelector('#btn-export-campaign');
        const inputImport = this.container.querySelector('#input-import-campaign');

        if (btnExport) {
            btnExport.addEventListener('click', () => this.handleExport());
        }

        if (inputImport) {
            inputImport.addEventListener('change', (e) => this.handleImport(e));
        }
    }

    handleExport() {
        const campaignData = this.model.exportCampaign();
        const jsonString = JSON.stringify(campaignData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `campaign_${dateStr}.json`;

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        URL.revokeObjectURL(url);
    }

    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const success = this.model.importCampaign(data);

                if (success) {
                    alert("Campaña importada correctamente. Se recargará la aplicación para aplicar los cambios.");
                    window.location.reload();
                } else {
                    alert("El archivo no tiene el formato correcto.");
                }
            } catch (err) {
                console.error("Error parsing campaign data:", err);
                alert("Error al leer el archivo. Asegúrate de que sea un JSON válido.");
            }

            // Reset input so the same file can be selected again
            event.target.value = '';
        };
        reader.readAsText(file);
    }

    destroy() {
        this.container.innerHTML = '';
    }
}
