import test from 'node:test';
import assert from 'node:assert';
import RumorsModel from './RumorsModel.js';
import { AIService } from '../../services/AIService.js';
import { LanguageService } from '../../core/LanguageService.js';
import { DEFAULTS } from './RumorsData.js';

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

    // Assert that the generated rumor is based on one of the templates
    let startsWithIntro = false;
    for (const intro of model.grammar.intros.es) {
        const baseIntro = intro.replace(/{townName}/g, 'Townsville');
        if (result.rumor.startsWith(baseIntro)) {
            startsWithIntro = true;
            break;
        }
    }
    assert.strictEqual(startsWithIntro, true, 'Rumor should start with a procedural intro');
    assert.ok(result.rumor.includes('Townsville'), 'Rumor should include town name');
    assert.ok(result.rumor.includes('Bob'), 'Rumor should include NPC name');
    assert.ok(result.rumor.includes('Baker'), 'Rumor should include NPC role');

    // Assert that the generated hook is one of the plot hooks
    assert.ok(model.grammar.hooks.es.includes(result.hook), 'Hook should match a procedural plot hook');

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

    assert.ok(result.rumor.includes(expectedTown) || result.rumor.includes(expectedNpc) || result.rumor.includes(expectedRole));

    // Restore mocks
    AIService.isConfigured = originalIsConfigured;
    LanguageService.currentLang = originalCurrentLang;
});
