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
    const town = 'Townsville';
    const npc = 'Bob';
    const role = 'Baker';
    const result = await model.generateRumor(town, npc, role);

    // Assert that result has rumor and hook properties
    assert.ok(result.rumor);
    assert.ok(result.hook);

    // Assert that variables are correctly injected
    assert.ok(result.rumor.includes(town), 'Rumor should contain the town name');
    assert.ok(result.rumor.includes(npc), 'Rumor should contain the NPC name');
    assert.ok(result.rumor.includes(role), 'Rumor should contain the NPC role');

    // Assert that the generated rumor uses the grammar elements
    let foundIntro = false;
    for (const intro of model.grammar.es.intros) {
        if (result.rumor.includes(intro)) {
            foundIntro = true;
            break;
        }
    }
    assert.strictEqual(foundIntro, true, 'Rumor should start with a grammar intro');

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

    assert.ok(result.rumor.includes(expectedTown) || result.rumor.includes(expectedNpc) || result.rumor.includes(expectedRole));

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
