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

    // Verify that the generated rumor strictly contains the provided variables
    assert.ok(result.rumor.includes(townName), `Generated rumor should contain the town name '${townName}'`);
    assert.ok(result.rumor.includes(npcName), `Generated rumor should contain the NPC name '${npcName}'`);
    assert.ok(result.rumor.includes(npcRole), `Generated rumor should contain the NPC role '${npcRole}'`);

    // Verify the hook length is somewhat sensible
    assert.ok(result.hook.length > 10, 'Hook should have a valid length');

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

    assert.ok(result.rumor.includes(expectedTown), `Generated rumor should contain default town '${expectedTown}'`);
    assert.ok(result.rumor.includes(expectedNpc), `Generated rumor should contain default NPC name '${expectedNpc}'`);
    assert.ok(result.rumor.includes(expectedRole), `Generated rumor should contain default NPC role '${expectedRole}'`);

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
