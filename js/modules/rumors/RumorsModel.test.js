import test from 'node:test';
import assert from 'node:assert';
import RumorsModel from './RumorsModel.js';
import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';

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

    // Verify the pre-loaded variables are injected correctly
    assert.ok(result.rumor.includes('Townsville'));
    assert.ok(result.rumor.includes('Bob'));
    assert.ok(result.rumor.includes('Baker'));

    // Check that one of the actions is contained in the rumor
    let foundAction = false;
    for (const action of model.grammar.es.actions) {
        if (result.rumor.includes(action)) {
            foundAction = true;
            break;
        }
    }
    assert.strictEqual(foundAction, true, 'Rumor should contain a procedural action');

    // Check that the generated hook is one of the procedural hooks (replaced if necessary)
    let foundHook = false;
    for (const hookTemplate of model.grammar.es.hooks) {
        const expectedHook = hookTemplate
            .replace(/{townName}/g, 'Townsville')
            .replace(/{npcName}/g, 'Bob')
            .replace(/{npcRole}/g, 'Baker');

        if (result.hook === expectedHook) {
            foundHook = true;
            break;
        }
    }
    assert.strictEqual(foundHook, true, 'Hook should match a replaced procedural plot hook');

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

    const expectedTown = model.defaultTown.es;
    const expectedNpc = model.defaultNpcName.es;
    const expectedRole = model.defaultNpcRole.es;

    assert.ok(result.rumor.includes(expectedTown));
    assert.ok(result.rumor.includes(expectedNpc));
    assert.ok(result.rumor.includes(expectedRole));

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
