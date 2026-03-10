import test from 'node:test';
import assert from 'node:assert';
import RumorsModel from './RumorsModel.js';

// Mock localStorage and window
global.window = {
    LanguageService: { currentLang: 'es' }
};
global.document = {
    querySelector: () => ({ lang: 'es' })
};

global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value.toString();
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

test('RumorsModel - can add and remove variables', async (t) => {
    localStorage.clear();
    const model = new RumorsModel();
    model.addVariable('towns', 'Neverwinter');

    assert.strictEqual(model.variables.towns.length, 1);
    assert.strictEqual(model.variables.towns[0], 'Neverwinter');

    model.removeVariable('towns', 0);
    assert.strictEqual(model.variables.towns.length, 0);
});

test('RumorsModel - can generate rumor', async (t) => {
    localStorage.clear();
    const model = new RumorsModel();
    model.addVariable('towns', 'Neverwinter');
    model.addVariable('npcs', 'Lord Dagult');
    model.addVariable('locations', 'the crypts');
    model.addVariable('items', 'a golden crown');

    const rumor = model.generateRumor();

    assert.strictEqual(model.generatedRumors.length, 1);
    assert.ok(rumor.id);
    assert.ok(rumor.text);
    // Even if it uses fallback text due to randomness, the string should be populated.
    assert.ok(rumor.text.length > 0);
});

test('RumorsModel - can delete rumor', async (t) => {
    localStorage.clear();
    const model = new RumorsModel();
    const rumor = model.generateRumor();
    assert.strictEqual(model.generatedRumors.length, 1);

    model.removeRumor(rumor.id);
    assert.strictEqual(model.generatedRumors.length, 0);
});

test('RumorsModel - loads from DataService correctly', async (t) => {
    localStorage.clear();
    const model1 = new RumorsModel();
    model1.addVariable('towns', 'Waterdeep');
    model1.generateRumor();
    // Automatically saved in localstorage via DataService.save() during adds

    const model2 = new RumorsModel();
    await model2.load();

    assert.strictEqual(model2.variables.towns[0], 'Waterdeep');
    assert.strictEqual(model2.generatedRumors.length, 1);
});
