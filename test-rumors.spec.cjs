const { test, expect } = require('@playwright/test');

test('Rumors Module Generates Rumor', async ({ page }) => {
  await page.goto('http://localhost:8000/');

  // Wait for the app to load
  await page.waitForSelector('.launcher-btn');

  // Click on "Susurros de Taberna" (data-module="rumors")
  await page.click('button[data-module="rumors"]');

  // Wait for the inputs to appear
  await page.waitForSelector('#input-town-name');

  // Fill the inputs
  await page.fill('#input-town-name', 'Testville');
  await page.fill('#input-npc-name', 'Bob');
  await page.fill('#input-npc-role', 'Baker');

  // Click generate
  await page.click('#btn-generate-rumor');

  // Wait for result to not be display none
  await page.waitForSelector('#rumor-result-container:not(.d-none)');

  // Verify the output text contains the values
  const rumorText = await page.locator('#output-rumor-text').textContent();
  const hookText = await page.locator('#output-rumor-hook').textContent();

  console.log("RUMOR TEXT:", rumorText);
  console.log("HOOK TEXT:", hookText);

  // Note: Town name is optional in the grammar, so we don't assert it to prevent flaky tests.
  expect(rumorText).toContain('Bob');
  expect(rumorText).toContain('Baker');
  expect(hookText.length).toBeGreaterThan(10);
});
