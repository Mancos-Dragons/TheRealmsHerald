import { test, describe } from 'node:test';
import assert from 'node:assert';
import NewspaperView from './NewspaperView.js';

// Mock LanguageService
const mockLanguageService = {
    get: (key) => key,
};

// Mock DOM if necessary, but since we're testing methods that return elements or use innerHTML
// we can just check the resulting el.innerHTML.
// However, NewspaperView.js imports LanguageService directly.
// We might need to mock the import or ensure it doesn't fail.

// For Node.js testing of DOM-related code, we can use a simple mock for document.createElement
global.document = {
    createElement: (tag) => ({
        tagName: tag.toUpperCase(),
        set className(val) { this._className = val; },
        get className() { return this._className; },
        set innerHTML(val) { this._innerHTML = val; },
        get innerHTML() { return this._innerHTML; },
        set draggable(val) { this._draggable = val; },
        dataset: {}
    })
};

test('NewspaperView should escape item content in createItemElement', () => {
    const view = new NewspaperView();
    const maliciousItem = {
        id: 1,
        type: 'news',
        title: '<img src=x onerror=alert(1)>',
        body: 'Malicious *bold* text <script>alert(2)</script>',
        image: '"> <script>alert(3)</script>',
        size: 'span-6'
    };

    const el = view.createItemElement(maliciousItem);

    // Check title
    assert.ok(el.innerHTML.includes('&lt;img src=x onerror=alert(1)&gt;'));
    assert.ok(!el.innerHTML.includes('<img src=x onerror=alert(1)>'));

    // Check body (markdown bold should still work)
    assert.ok(el.innerHTML.includes('Malicious <strong>bold</strong> text'));
    assert.ok(el.innerHTML.includes('&lt;script&gt;alert(2)&lt;/script&gt;'));
    assert.ok(!el.innerHTML.includes('<script>alert(2)</script>'));

    // Check image src
    assert.ok(el.innerHTML.includes('src="&quot;&gt; &lt;script&gt;alert(3)&lt;/script&gt;"'));
});

test('NewspaperView should escape special item content', () => {
    const view = new NewspaperView();
    const specialItem = {
        id: 2,
        type: 'special',
        specialStyle: 'style-wanted',
        title: '<script>alert("title")</script>',
        body: '<script>alert("body")</script>',
        extra: '<script>alert("extra")</script>',
        image: '"><script>alert("img")</script>'
    };

    const el = view.createItemElement(specialItem);

    assert.ok(el.innerHTML.includes('&lt;script&gt;alert(&quot;title&quot;)&lt;/script&gt;'));
    assert.ok(el.innerHTML.includes('&lt;script&gt;alert(&quot;body&quot;)&lt;/script&gt;'));
    assert.ok(el.innerHTML.includes('&lt;script&gt;alert(&quot;extra&quot;)&lt;/script&gt;'));
    assert.ok(el.innerHTML.includes('src="&quot;&gt;&lt;script&gt;alert(&quot;img&quot;)&lt;/script&gt;"'));
});

test('NewspaperView should escape banner content', () => {
    const view = new NewspaperView();
    const bannerItem = {
        id: 3,
        type: 'ad',
        size: 'banner',
        title: '<u>Underline</u>',
        body: '<i>Italic</i>'
    };

    const el = view.createBannerElement(bannerItem);

    assert.ok(el.innerHTML.includes('&lt;u&gt;Underline&lt;/u&gt;'));
    assert.ok(el.innerHTML.includes('&lt;i&gt;Italic&lt;/i&gt;'));
});
