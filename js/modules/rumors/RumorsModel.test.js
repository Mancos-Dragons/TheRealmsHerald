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

    // Verify it contains the provided placeholders
    assert.ok(result.rumor.includes('Townsville'), 'Rumor should include townName');
    assert.ok(result.rumor.includes('Bob'), 'Rumor should include npcName');
    assert.ok(result.rumor.includes('Baker'), 'Rumor should include npcRole');

    // Verify grammar fragments were used (for rumor)
    let foundIntro = false;
    for (const intro of model.grammar.es.rumors.intros) {
        if (result.rumor.startsWith(intro)) {
            foundIntro = true;
            break;
        }
    }
    assert.strictEqual(foundIntro, true, 'Rumor should start with a valid intro');

    // Verify grammar fragments were used (for hook)
    let foundHookIntro = false;
    for (const intro of model.grammar.es.hooks.intros) {
        if (result.hook.startsWith(intro)) {
            foundHookIntro = true;
            break;
        }
    }
    assert.strictEqual(foundHookIntro, true, 'Hook should start with a valid intro');

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
        result.rumor.includes(expectedTown) &&
        result.rumor.includes(expectedNpc) &&
        result.rumor.includes(expectedRole),
        'Rumor should include all default placeholders'
    );

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});