import test from 'node:test';
import assert from 'node:assert';
import RumorsModel from './RumorsModel.js';
import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { RUMOR_TEMPLATES, PLOT_HOOKS } from './RumorsData.js';

test('RumorsModel - Procedural generation fallback', async (t) => {
    // Mock the AIService to return null, forcing procedural fallback
    const originalIsConfigured = AIService.isConfigured;
    AIService.isConfigured = () => false;

    // Set LanguageService language
    LanguageService.currentLang = 'es';

    const model = new RumorsModel();
    const result = await model.generateRumor('TestTown', 'TestNPC', 'TestRole');

    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Verify that the generated strings include our inputs if the template had placeholders
    // (though not all templates use all placeholders, most do)

    // Check if the generated rumor matches one of the templates (with replacements)
    const temps = RUMOR_TEMPLATES['es'];
    const hooks = PLOT_HOOKS['es'];

    let matchedRumor = false;
    for (const temp of temps) {
        let expected = temp
            .replace(/{townName}/g, 'TestTown')
            .replace(/{npcName}/g, 'TestNPC')
            .replace(/{npcRole}/g, 'TestRole');
        if (result.rumor === expected) {
            matchedRumor = true;
            break;
        }
    }
    assert.ok(matchedRumor, 'The generated rumor should match a procedural template');
    assert.ok(hooks.includes(result.hook), 'The generated hook should be in the list of procedural hooks');

    // Restore original functions
    AIService.isConfigured = originalIsConfigured;
});

test('RumorsModel - Default values are used when parameters are missing', async (t) => {
    // Mock the AIService to return null, forcing procedural fallback
    const originalIsConfigured = AIService.isConfigured;
    AIService.isConfigured = () => false;

    LanguageService.currentLang = 'en';

    const model = new RumorsModel();
    const result = await model.generateRumor('', '', '');

    assert.ok(result.rumor);
    assert.ok(result.hook);

    const temps = RUMOR_TEMPLATES['en'];
    let matchedRumor = false;
    for (const temp of temps) {
        let expected = temp
            .replace(/{townName}/g, 'Old Town')
            .replace(/{npcName}/g, 'Unknown')
            .replace(/{npcRole}/g, 'Traveler');
        if (result.rumor === expected) {
            matchedRumor = true;
            break;
        }
    }
    assert.ok(matchedRumor, 'The generated rumor should match a procedural template using default variables');

    // Restore original functions
    AIService.isConfigured = originalIsConfigured;
});
