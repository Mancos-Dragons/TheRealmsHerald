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

    // Assert that the generated rumor includes the pre-loaded variables strictly
    assert.ok(result.rumor.includes(townName), 'Generated rumor should include the town name');
    assert.ok(result.rumor.includes(npcName), 'Generated rumor should include the NPC name');
    assert.ok(result.rumor.includes(npcRole), 'Generated rumor should include the NPC role');

    // Assert that the generated hook is one of the plot hooks in the grammar
    const esHooks = model.grammar.es.hooks;
    assert.ok(esHooks.includes(result.hook), 'Hook should match a procedural plot hook from the grammar');

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

    assert.ok(result.rumor.includes(expectedTown), 'Generated rumor should include the default town name');
    assert.ok(result.rumor.includes(expectedNpc), 'Generated rumor should include the default NPC name');
    assert.ok(result.rumor.includes(expectedRole), 'Generated rumor should include the default NPC role');

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});