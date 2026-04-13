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
    assert.strictEqual(typeof result.rumor, 'string');
    assert.strictEqual(typeof result.hook, 'string');
    assert.ok(result.rumor.length > 0);
    assert.ok(result.hook.length > 0);

    // Assert that the guaranteed variables are present
    assert.ok(result.rumor.includes('Bob') || result.hook.includes('Bob'));

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
    assert.strictEqual(typeof result.rumor, 'string');
    assert.strictEqual(typeof result.hook, 'string');
    assert.ok(result.rumor.length > 0);
    assert.ok(result.hook.length > 0);

    const expectedTown = model.grammar.es.defaults.town;
    const expectedNpc = model.grammar.es.defaults.npcName;
    const expectedRole = model.grammar.es.defaults.npcRole;

    assert.ok(result.rumor.includes(expectedTown) || result.rumor.includes(expectedNpc) || result.rumor.includes(expectedRole));

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
