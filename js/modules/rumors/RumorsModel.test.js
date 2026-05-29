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

    // Assert that the generated rumor strictly contains the required variables
    assert.ok(result.rumor.includes('Townsville'), 'Rumor should contain townName');
    assert.ok(result.rumor.includes('Bob'), 'Rumor should contain npcName');
    assert.ok(result.rumor.includes('Baker'), 'Rumor should contain npcRole');

    // Assert that the generated hook strictly contains the required variables
    assert.ok(result.hook.includes('Townsville'), 'Hook should contain townName');
    assert.ok(result.hook.includes('Bob'), 'Hook should contain npcName');
    assert.ok(result.hook.includes('Baker'), 'Hook should contain npcRole');

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

    assert.ok(result.rumor.includes(expectedTown), 'Rumor should contain default townName');
    assert.ok(result.rumor.includes(expectedNpc), 'Rumor should contain default npcName');
    assert.ok(result.rumor.includes(expectedRole), 'Rumor should contain default npcRole');

    assert.ok(result.hook.includes(expectedTown), 'Hook should contain default townName');
    assert.ok(result.hook.includes(expectedNpc), 'Hook should contain default npcName');
    assert.ok(result.hook.includes(expectedRole), 'Hook should contain default npcRole');

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
