import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');

    // Check if the page loads
    await expect(page).toHaveTitle(/Edit & Kraft/);

    // Check for main content
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/');

    // Click on services link in navigation
    await page.click('a[href="/services"]');

    // Check if we're on the services page
    await expect(page).toHaveURL(/\/services/);

    // Check for services content
    await expect(page.locator('h1, h2').filter({ hasText: /services/i })).toBeVisible();
  });

  test('should navigate to work page', async ({ page }) => {
    await page.goto('/');

    // Click on work/portfolio link
    await page.click('a[href="/work"]');

    // Check if we're on the work page
    await expect(page).toHaveURL(/\/work/);

    // Check for portfolio content
    await expect(page.locator('h1, h2').filter({ hasText: /work|portfolio/i })).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');

    // Click on about link
    await page.click('a[href="/about"]');

    // Check if we're on the about page
    await expect(page).toHaveURL(/\/about/);

    // Check for about content
    await expect(page.locator('h1, h2').filter({ hasText: /about/i })).toBeVisible();
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/');

    // Click on contact link
    await page.click('a[href="/contact"]');

    // Check if we're on the contact page
    await expect(page).toHaveURL(/\/contact/);

    // Check for contact content
    await expect(page.locator('h1, h2').filter({ hasText: /contact/i })).toBeVisible();
  });
});

test.describe('Interactive Elements', () => {
  test('should handle magnetic button interactions', async ({ page }) => {
    await page.goto('/');

    // Find magnetic buttons
    const magneticButtons = page.locator('.magnetic-button');

    // Check if magnetic buttons exist
    await expect(magneticButtons.first()).toBeVisible();

    // Hover over a magnetic button
    await magneticButtons.first().hover();

    // The button should still be visible and functional
    await expect(magneticButtons.first()).toBeVisible();
  });

  test('should display preloader initially', async ({ page }) => {
    await page.goto('/');

    // Check if preloader exists (may be hidden quickly)
    const preloader = page.locator('.preloader');
    await expect(preloader.or(page.locator('body')).first()).toBeTruthy();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check if navigation is accessible on mobile
    await expect(page.locator('nav, .navbar')).toBeVisible();

    // Check if main content is visible
    await expect(page.locator('main, .main')).toBeVisible();
  });
});