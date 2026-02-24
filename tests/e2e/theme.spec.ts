import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('toggles theme to dark mode', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    expect(isDarkMode).toBe(true);
  });

  test('toggles theme to light mode', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    expect(isDarkMode).toBe(false);
  });

  test('persists theme after page reload', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    const savedThemeBeforeReload = await page.evaluate(() => {
      return localStorage.getItem('password-generator-theme');
    });
    
    expect(savedThemeBeforeReload).toBe('dark');
    
    await page.reload();
    await page.waitForTimeout(500);
    
    const isDarkModeAfterReload = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    expect(isDarkModeAfterReload).toBe(true);
    
    const savedThemeAfterReload = await page.evaluate(() => {
      return localStorage.getItem('password-generator-theme');
    });
    
    expect(savedThemeAfterReload).toBe('dark');
  });
});
