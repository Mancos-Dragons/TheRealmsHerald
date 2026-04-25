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

    // Verify rumor text has all required variables replaced
    assert.ok(result.rumor.includes('Townsville'), 'Rumor should include Townsville');
    assert.ok(result.rumor.includes('Bob'), 'Rumor should include Bob');
    assert.ok(result.rumor.includes('Baker'), 'Rumor should include Baker');

    // Verify hook text has all required variables replaced
    assert.ok(result.hook.includes('Townsville') || result.hook.includes('Bob') || result.hook.includes('Baker'), 'Hook should include replaced variables');
    if (result.hook.includes('{townName}') || result.hook.includes('{npcName}') || result.hook.includes('{npcRole}')) {
        assert.fail('Hook should not contain unreplaced variables: ' + result.hook);
    }

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

    assert.ok(result.rumor.includes(expectedTown) || result.rumor.includes(expectedNpc) || result.rumor.includes(expectedRole));

    // Ensure hook has no unreplaced template strings
    if (result.hook.includes('{townName}') || result.hook.includes('{npcName}') || result.hook.includes('{npcRole}')) {
        assert.fail('Hook should not contain unreplaced variables: ' + result.hook);
    }

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
