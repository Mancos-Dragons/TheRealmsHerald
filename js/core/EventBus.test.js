import { test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { EventBusImpl } from './EventBus.js';

test('EventBus unit tests', async (t) => {
    let bus;

    beforeEach(() => {
        bus = new EventBusImpl();
    });

    await t.test('should allow subscribing to and emitting events', () => {
        let called = false;
        let receivedData = null;
        const callback = (data) => {
            called = true;
            receivedData = data;
        };

        bus.on('test-event', callback);
        bus.emit('test-event', { foo: 'bar' });

        assert.strictEqual(called, true, 'Callback should have been called');
        assert.deepStrictEqual(receivedData, { foo: 'bar' }, 'Callback should receive the correct data');
    });

    await t.test('should allow unsubscribing from events', () => {
        let callCount = 0;
        const callback = () => {
            callCount++;
        };

        bus.on('off-event', callback);
        bus.emit('off-event');
        assert.strictEqual(callCount, 1, 'Callback should have been called once');

        bus.off('off-event', callback);
        bus.emit('off-event');
        assert.strictEqual(callCount, 1, 'Callback should not have been called after off()');
    });

    await t.test('should support multiple subscribers for the same event', () => {
        let count1 = 0;
        let count2 = 0;
        const cb1 = () => count1++;
        const cb2 = () => count2++;

        bus.on('multi-event', cb1);
        bus.on('multi-event', cb2);

        bus.emit('multi-event');

        assert.strictEqual(count1, 1);
        assert.strictEqual(count2, 1);

        bus.off('multi-event', cb1);
        bus.emit('multi-event');

        assert.strictEqual(count1, 1);
        assert.strictEqual(count2, 2);
    });

    await t.test('should handle emitting events with no subscribers', () => {
        assert.doesNotThrow(() => {
            bus.emit('non-existent-event', { data: 123 });
        });
    });

    await t.test('should handle unsubscribing from non-existent events', () => {
        assert.doesNotThrow(() => {
            bus.off('non-existent-event', () => {});
        });
    });
});
