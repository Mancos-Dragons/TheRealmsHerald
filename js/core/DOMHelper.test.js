import { test } from 'node:test';
import assert from 'node:assert';
import { escapeHTML } from './DOMHelper.js';

test('escapeHTML should escape special characters', () => {
    assert.strictEqual(escapeHTML('<b>hello</b>'), '&lt;b&gt;hello&lt;/b&gt;');
    assert.strictEqual(escapeHTML('John & Jane'), 'John &amp; Jane');
    assert.strictEqual(escapeHTML('He said "Hello"'), 'He said &quot;Hello&quot;');
    assert.strictEqual(escapeHTML("It's a trap"), 'It&#39;s a trap');
});

test('escapeHTML should handle non-string inputs', () => {
    assert.strictEqual(escapeHTML(null), null);
    assert.strictEqual(escapeHTML(undefined), undefined);
    assert.strictEqual(escapeHTML(123), 123);
});

test('escapeHTML should escape XSS payloads', () => {
    const payload = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    assert.strictEqual(escapeHTML(payload), expected);

    const attrPayload = '"><img src=x onerror=alert(1)>';
    const expectedAttr = '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;';
    assert.strictEqual(escapeHTML(attrPayload), expectedAttr);
});
