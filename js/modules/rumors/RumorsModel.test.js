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

    const testTown = 'Townsville';
    const testNpc = 'Bob';
    const testRole = 'Baker';

    // Call generateRumor
    const result = await model.generateRumor(testTown, testNpc, testRole);

    // Assert that result has rumor and hook properties
    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Assert that the generated rumor contains the provided variables
    assert.ok(result.rumor.includes(testTown), `Rumor should contain the town name. Rumor: ${result.rumor}`);
    assert.ok(result.rumor.includes(testNpc), `Rumor should contain the NPC name. Rumor: ${result.rumor}`);
    assert.ok(result.rumor.includes(testRole), `Rumor should contain the NPC role. Rumor: ${result.rumor}`);

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

    assert.ok(
        result.rumor.includes(expectedTown) ||
        result.rumor.includes(expectedNpc) ||
        result.rumor.includes(expectedRole),
        'Rumor should contain at least one of the default values'
    );

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
