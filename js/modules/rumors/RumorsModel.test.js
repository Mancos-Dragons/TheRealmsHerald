import test from 'node:test';
import assert from 'node:assert';
import RumorsModel from './RumorsModel.js';
import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { RUMOR_TEMPLATES, PLOT_HOOKS, DEFAULT_TOWN, DEFAULT_NPC_NAME, DEFAULT_NPC_ROLE } from './RumorsData.js';

test('RumorsModel', async (t) => {

    await t.test('generateRumor', async (t) => {
        await t.test('should fallback to procedural generation from RumorsData when AIService is unconfigured', async () => {
            // Mock LanguageService
            LanguageService.currentLang = 'es';

            // Mock AIService
            const originalIsConfigured = AIService.isConfigured;
            AIService.isConfigured = () => false;

            const model = new RumorsModel();
            const result = await model.generateRumor('TestTown', 'TestNPC', 'TestRole');

            assert.ok(result.rumor, 'Result should have a rumor');
            assert.ok(result.hook, 'Result should have a hook');

            // Verify the generated rumor string comes from the templates
            const temps = RUMOR_TEMPLATES['es'];
            let foundMatch = false;
            for (const temp of temps) {
                let replaced = temp.replace(/{townName}/g, 'TestTown')
                                   .replace(/{npcName}/g, 'TestNPC')
                                   .replace(/{npcRole}/g, 'TestRole');
                if (result.rumor === replaced) {
                    foundMatch = true;
                    break;
                }
            }
            assert.ok(foundMatch, 'Generated rumor should match a procedural template');

            // Verify the generated hook string comes from the templates
            assert.ok(PLOT_HOOKS['es'].includes(result.hook), 'Generated hook should be from the PLOT_HOOKS list');

            // Restore AIService
            AIService.isConfigured = originalIsConfigured;
        });

        await t.test('should fallback to procedural generation with default values if inputs are missing', async () => {
            // Mock LanguageService
            LanguageService.currentLang = 'en';

            // Mock AIService
            const originalIsConfigured = AIService.isConfigured;
            AIService.isConfigured = () => false;

            const model = new RumorsModel();
            const result = await model.generateRumor();

            assert.ok(result.rumor, 'Result should have a rumor');
            assert.ok(result.hook, 'Result should have a hook');

            const expectedTown = DEFAULT_TOWN['en'];
            const expectedName = DEFAULT_NPC_NAME['en'];
            const expectedRole = DEFAULT_NPC_ROLE['en'];

            // Verify the generated rumor string comes from the templates
            const temps = RUMOR_TEMPLATES['en'];
            let foundMatch = false;
            for (const temp of temps) {
                let replaced = temp.replace(/{townName}/g, expectedTown)
                                   .replace(/{npcName}/g, expectedName)
                                   .replace(/{npcRole}/g, expectedRole);
                if (result.rumor === replaced) {
                    foundMatch = true;
                    break;
                }
            }
            assert.ok(foundMatch, 'Generated rumor should match a procedural template with default values');

            // Restore AIService
            AIService.isConfigured = originalIsConfigured;
        });
    });
});