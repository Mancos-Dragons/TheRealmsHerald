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

    // Ensure parameters are replaced in result
    assert.ok(result.rumor.includes('Townsville') || result.hook.includes('Townsville'), 'Result should include Townsville');
    assert.ok(result.rumor.includes('Bob') || result.hook.includes('Bob'), 'Result should include Bob');
    assert.ok(result.rumor.includes('Baker') || result.hook.includes('Baker'), 'Result should include Baker');

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

    assert.ok(result.rumor.includes(expectedTown) || result.hook.includes(expectedTown));
    assert.ok(result.rumor.includes(expectedNpc) || result.hook.includes(expectedNpc));
    assert.ok(result.rumor.includes(expectedRole) || result.hook.includes(expectedRole));

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
