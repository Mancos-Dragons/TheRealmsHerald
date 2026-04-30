import test from 'node:test';
import assert from 'node:assert';
import RumorsModel, { DEFAULTS } from './RumorsModel.js';
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

    // Assert that the generated rumor contains the provided inputs
    assert.ok(result.rumor.includes(townName), `Rumor should contain townName: ${townName}`);
    assert.ok(result.rumor.includes(npcName), `Rumor should contain npcName: ${npcName}`);
    assert.ok(result.rumor.includes(npcRole), `Rumor should contain npcRole: ${npcRole}`);

    // Assert that the generated hook is not empty
    assert.ok(result.hook.length > 0, 'Hook should not be empty');

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

    const expectedTown = DEFAULTS.town.es;
    const expectedNpc = DEFAULTS.npcName.es;
    const expectedRole = DEFAULTS.npcRole.es;

    assert.ok(result.rumor.includes(expectedTown), `Rumor should contain expectedTown: ${expectedTown}`);
    assert.ok(result.rumor.includes(expectedNpc), `Rumor should contain expectedNpc: ${expectedNpc}`);
    assert.ok(result.rumor.includes(expectedRole), `Rumor should contain expectedRole: ${expectedRole}`);

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
