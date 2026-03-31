import RumorsModel from './RumorsModel.js';
import RumorsView from './RumorsView.js';
import { EventBus } from '../../core/EventBus.js';

export default class RumorsController {
    constructor(container) {
        this.container = container;
        this.model = new RumorsModel();
        this.view = new RumorsView(this.container);
    }

    async init() {
        this.view.render(this.model);
        this.attachEvents();
    }

    attachEvents() {
        const generateBtn = this.container.querySelector('#btn-generate-rumor');
        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                const townName = this.container.querySelector('#input-town-name').value || '';
                const npcName = this.container.querySelector('#input-npc-name').value || '';
                const npcRole = this.container.querySelector('#input-npc-role').value || '';

                this.view.setLoading(true);
                try {
                    const result = await this.model.generateRumor(townName, npcName, npcRole);
                    this.view.updateResult(result);
                    EventBus.emit('journal_entry_added', {
                        module: 'rumors',
                        title: `Rumor en ${townName || 'Pueblo'}`,
                        details: result.rumor,
                        metadata: { npc: npcName, role: npcRole, hook: result.hook }
                    });
                } catch (error) {
                    console.error("RumorsController: Error generating rumor", error);
                } finally {
                    this.view.setLoading(false);
                }
            });
        }
    }

    destroy() {
        this.container.innerHTML = '';
    }
}