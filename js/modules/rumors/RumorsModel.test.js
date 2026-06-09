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

    const townName = 'Townsville';
    const npcName = 'Bob';
    const npcRole = 'Baker';

    // Call generateRumor
    const result = await model.generateRumor(townName, npcName, npcRole);

    // Assert that result has rumor and hook properties
    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Verify the required tokens are present in the generated rumor text
    assert.ok(result.rumor.includes(townName), `Rumor should contain the town name "${townName}"`);
    assert.ok(result.rumor.includes(npcName), `Rumor should contain the npc name "${npcName}"`);
    assert.ok(result.rumor.includes(npcRole), `Rumor should contain the npc role "${npcRole}"`);

    // Assert that the generated hook is one of the procedural hooks
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

    const expectedTown = model.defaultTown.es;
    const expectedNpc = model.defaultNpcName.es;
    const expectedRole = model.defaultNpcRole.es;

    assert.ok(result.rumor.includes(expectedTown), `Rumor should contain the default town name "${expectedTown}"`);
    assert.ok(result.rumor.includes(expectedNpc), `Rumor should contain the default npc name "${expectedNpc}"`);
    assert.ok(result.rumor.includes(expectedRole), `Rumor should contain the default npc role "${expectedRole}"`);

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
