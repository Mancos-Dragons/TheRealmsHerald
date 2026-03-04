import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { DataService } from './DataService.js';

describe('DataService', () => {
    // Mocking localStorage
    const mockLocalStorage = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => {
                store[key] = value.toString();
            },
            removeItem: (key) => {
                delete store[key];
            },
            clear: () => {
                store = {};
            }
        };
    })();

    beforeEach(() => {
        global.localStorage = mockLocalStorage;
        global.localStorage.clear();
        global.console.log = () => {}; // Silence logs
        global.console.error = () => {}; // Silence errors
    });

    afterEach(() => {
        delete global.localStorage;
    });

    describe('save', () => {
        test('should save data to localStorage correctly', () => {
            const key = 'testKey';
            const data = { name: 'Herald' };

            DataService.save(key, data);

            const savedData = JSON.parse(localStorage.getItem(key));
            assert.deepStrictEqual(savedData, data);
        });

        test('should handle exceptions when localStorage.setItem fails', () => {
            const key = 'testKey';
            const data = { name: 'Herald' };
            const errorMessage = 'Quota exceeded';

            // Mock setItem to throw an error
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = () => {
                throw new Error(errorMessage);
            };

            let consoleErrorCalled = false;
            const originalConsoleError = console.error;
            console.error = (...args) => {
                consoleErrorCalled = true;
                // You can optionally check for specific error message
                // assert.strictEqual(args[0], "Error guardando datos");
            };

            try {
                DataService.save(key, data);
                assert.strictEqual(consoleErrorCalled, true, 'console.error should have been called');
            } finally {
                // Restore original functions
                localStorage.setItem = originalSetItem;
                console.error = originalConsoleError;
            }
        });
    });

    describe('load', () => {
        test('should load data from localStorage correctly', () => {
            const key = 'testKey';
            const data = { name: 'Herald' };
            localStorage.setItem(key, JSON.stringify(data));

            const loadedData = DataService.load(key);
            assert.deepStrictEqual(loadedData, data);
        });

        test('should return null if key does not exist', () => {
            const loadedData = DataService.load('nonExistentKey');
            assert.strictEqual(loadedData, null);
        });
    });
});
