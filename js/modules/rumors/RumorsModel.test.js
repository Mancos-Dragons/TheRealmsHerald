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

    // Assert that the generated rumor is based on the procedural grammar logic
    // Ensure all variables were replaced correctly
    assert.strictEqual(result.rumor.includes('{townName}'), false, 'Rumor should not contain raw variable {townName}');
    assert.strictEqual(result.rumor.includes('{npcName}'), false, 'Rumor should not contain raw variable {npcName}');
    assert.strictEqual(result.rumor.includes('{npcRole}'), false, 'Rumor should not contain raw variable {npcRole}');

    // Ensure they were replaced with correct values
    assert.ok(result.rumor.includes('Townsville') || result.hook.includes('Townsville') || result.rumor.includes('Bob') || result.rumor.includes('Baker'), 'Should include at least one template variable replacement');

    // Test the specific fallback replacement logic if needed, but it should just not have the brackets.
    let isValidRumor = false;
    for (const intro of model.grammar.es.intros) {
        if (result.rumor.includes(intro.replace('{townName}', 'Townsville'))) {
            isValidRumor = true;
            break;
        }
    }
    assert.strictEqual(isValidRumor, true, 'Rumor should include a valid intro from the procedural grammar');

    // Assert that the generated hook is one of the plot hooks
    let isValidHook = false;
    for (const hook of model.grammar.es.hooks) {
        if (result.hook === hook.replace(/{townName}/g, 'Townsville').replace(/{npcName}/g, 'Bob').replace(/{npcRole}/g, 'Baker')) {
            isValidHook = true;
            break;
        }
    }
    assert.ok(isValidHook, 'Hook should match a procedural plot hook');

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
