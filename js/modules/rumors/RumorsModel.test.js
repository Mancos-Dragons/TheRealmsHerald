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

    // Assert that the generated rumor is built from the grammar and includes the required variables
    assert.ok(result.rumor.includes(townName) || result.rumor.includes(npcName) || result.rumor.includes(npcRole), 'Rumor should include at least one of the parameters');

    // Check that the generated rumor and hook include the strictly required passed parameters
    assert.ok(result.rumor.includes(npcName), 'Rumor should include npcName');
    assert.ok(result.rumor.includes(npcRole), 'Rumor should include npcRole');

    assert.ok(result.hook.includes(npcName), 'Hook should include npcName');
    assert.ok(result.hook.includes(npcRole), 'Hook should include npcRole');

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

    assert.ok(result.rumor.includes(expectedNpc), 'Rumor should include default npc');
    assert.ok(result.rumor.includes(expectedRole), 'Rumor should include default role');

    assert.ok(result.hook.includes(expectedNpc), 'Hook should include default npc');
    assert.ok(result.hook.includes(expectedRole), 'Hook should include default role');

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
