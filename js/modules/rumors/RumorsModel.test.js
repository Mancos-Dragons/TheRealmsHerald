import test from 'node:test';
import assert from 'node:assert';
import RumorsModel from './RumorsModel.js';
import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { RUMOR_TEMPLATES, PLOT_HOOKS, DEFAULTS } from './RumorsData.js';

test('RumorsModel - fallback to procedural generation when AIService is not configured', async (t) => {
    // Mock the AIService
    const originalIsConfigured = AIService.isConfigured;
    AIService.isConfigured = () => false;

    // Mock LanguageService
    const originalCurrentLang = LanguageService.currentLang;
    LanguageService.currentLang = 'es';

    const model = new RumorsModel();

    // Call generateRumor
    const result = await model.generateRumor('Townsville', 'Bob', 'Baker');

    // Assert that result has rumor and hook properties
    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Assert that the generated rumor is based on one of the templates
    let foundTemplate = false;
    for (const template of RUMOR_TEMPLATES.es) {
        // Simple regex to match replaced template roughly, or just check that template starts matching
        const baseTemplate = template
            .replace(/{townName}/g, 'Townsville')
            .replace(/{npcName}/g, 'Bob')
            .replace(/{npcRole}/g, 'Baker');

        if (result.rumor === baseTemplate) {
            foundTemplate = true;
            break;
        }
    }
    assert.strictEqual(foundTemplate, true, 'Rumor should match a procedural template');

    // Assert that the generated hook is one of the plot hooks
    assert.ok(PLOT_HOOKS.es.includes(result.hook), 'Hook should match a procedural plot hook');

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});

test('RumorsModel - uses defaults when arguments are empty', async (t) => {
    // Mock the AIService
    const originalIsConfigured = AIService.isConfigured;
    AIService.isConfigured = () => false;

    // Mock LanguageService
    const originalCurrentLang = LanguageService.currentLang;
    LanguageService.currentLang = 'es';

    const model = new RumorsModel();

    // Call generateRumor without parameters
    const result = await model.generateRumor(null, null, null);

    assert.ok(result.rumor);
    assert.ok(result.hook);

    const expectedTown = DEFAULTS.town.es;
    const expectedNpc = DEFAULTS.npcName.es;
    const expectedRole = DEFAULTS.npcRole.es;

    assert.ok(result.rumor.includes(expectedTown) || result.rumor.includes(expectedNpc) || result.rumor.includes(expectedRole));

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
