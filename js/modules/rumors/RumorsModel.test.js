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
    const townName = 'Townsville';
    const npcName = 'Bob';
    const npcRole = 'Baker';
    const result = await model.generateRumor(townName, npcName, npcRole);

    // Assert that result has rumor and hook properties
    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Assert that the generated rumor incorporates the variables
    assert.strictEqual(result.rumor.includes(townName), true, 'Rumor should include townName');
    assert.strictEqual(result.rumor.includes(npcName), true, 'Rumor should include npcName');
    assert.strictEqual(result.rumor.includes(npcRole), true, 'Rumor should include npcRole');

    // Assert that the generated hook is one of the grammar plot hooks
    assert.ok(model.grammar.es.hooks.includes(result.hook), 'Hook should match a procedural plot hook');

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

    const expectedTown = model.defaults.town.es;
    const expectedNpc = model.defaults.npcName.es;
    const expectedRole = model.defaults.npcRole.es;

    assert.strictEqual(result.rumor.includes(expectedTown), true, 'Rumor should include default townName');
    assert.strictEqual(result.rumor.includes(expectedNpc), true, 'Rumor should include default npcName');
    assert.strictEqual(result.rumor.includes(expectedRole), true, 'Rumor should include default npcRole');

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
