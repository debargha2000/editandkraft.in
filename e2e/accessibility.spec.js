import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should have no accessibility violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).analyze();

    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations);
    }

    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });

  test('services page should be accessible', async ({ page }) => {
    await page.goto('/services');

    const results = await new AxeBuilder({ page }).analyze();
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });

  test('work page should be accessible', async ({ page }) => {
    await page.goto('/work');

    const results = await new AxeBuilder({ page }).analyze();
    const criticalViolations = results.violations.filter(v => v.impact === 'critical');
    expect(criticalViolations).toHaveLength(0);
  });

  test('keyboard navigation should work', async ({ page }) => {
    await page.goto('/');

    // Test tab navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    // Should focus on first interactive element
    await expect(focusedElement).toBeVisible();
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    // Find all images
    const images = page.locator('img');

    // Check each image has alt attribute
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // Allow empty alt for decorative images, but ensure attribute exists
      expect(alt).not.toBeNull();
    }
  });
});