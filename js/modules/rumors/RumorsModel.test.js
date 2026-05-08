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

    const town = 'Townsville';
    const npc = 'Bob';
    const role = 'Baker';

    // Call generateRumor
    const result = await model.generateRumor(town, npc, role);

    // Assert that result has rumor and hook properties
    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Assert that the generated rumor and hook include the input strings
    assert.ok(result.rumor.includes(town), 'Rumor should include town name');
    assert.ok(result.rumor.includes(npc), 'Rumor should include npc name');
    assert.ok(result.rumor.includes(role), 'Rumor should include npc role');

    assert.ok(result.hook.includes(town), 'Hook should include town name');
    assert.ok(result.hook.includes(npc), 'Hook should include npc name');
    assert.ok(result.hook.includes(role), 'Hook should include npc role');

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

    // Assert that the generated rumor and hook include the default strings
    assert.ok(result.rumor.includes(expectedTown), 'Rumor should include default town name');
    assert.ok(result.rumor.includes(expectedNpc), 'Rumor should include default npc name');
    assert.ok(result.rumor.includes(expectedRole), 'Rumor should include default npc role');

    assert.ok(result.hook.includes(expectedTown), 'Hook should include default town name');
    assert.ok(result.hook.includes(expectedNpc), 'Hook should include default npc name');
    assert.ok(result.hook.includes(expectedRole), 'Hook should include default npc role');

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
