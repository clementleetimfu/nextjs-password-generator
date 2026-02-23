import { test, expect } from '@playwright/test';

test.describe('Responsive Design E2E Tests', () => {
  test('should display correctly on extra large desktop (2560x1440)', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on large desktop (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on desktop (1440x900)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on laptop (1366x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on small laptop (1280x720)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on tablet (1024x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on tablet portrait (768x1024)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on large tablet (834x1194)', async ({ page }) => {
    await page.setViewportSize({ width: 834, height: 1194 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on mobile large (428x926)', async ({ page }) => {
    await page.setViewportSize({ width: 428, height: 926 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on mobile (414x896)', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on mobile small (375x812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on mobile smaller (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should display correctly on mobile tiny (320x568)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    const tabs = page.locator('[data-testid="tabs"]');
    await expect(tabs).toBeVisible();
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should handle orientation change from portrait to landscape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    // Rotate to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);
    
    await expect(mainContent).toBeVisible();
  });

  test('should handle orientation change from landscape to portrait', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    // Rotate to portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    await expect(mainContent).toBeVisible();
  });

  test('should handle tablet orientation change', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    await expect(mainContent).toBeVisible();
    
    // Rotate to landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(300);
    
    await expect(mainContent).toBeVisible();
  });

  test('should show all tabs on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    await expect(passwordTab).toBeVisible();
    await expect(pinTab).toBeVisible();
    await expect(passphraseTab).toBeVisible();
  });

  test('should show all tabs on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    await expect(passwordTab).toBeVisible();
    await expect(pinTab).toBeVisible();
    await expect(passphraseTab).toBeVisible();
  });

  test('should show all tabs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.locator('[data-testid="tab-password"]');
    const pinTab = page.locator('[data-testid="tab-pin"]');
    const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
    
    await expect(passwordTab).toBeVisible();
    await expect(pinTab).toBeVisible();
    await expect(passphraseTab).toBeVisible();
  });

  test('should show all controls on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
  });

  test('should show all controls on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
  });

  test('should show all controls on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const lengthSlider = page.locator('[data-testid="length-slider"]');
    const digitToggle = page.locator('[data-testid="toggle-digits"]');
    const uppercaseToggle = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsToggle = page.locator('[data-testid="toggle-symbols"]');
    
    await expect(lengthSlider).toBeVisible();
    await expect(digitToggle).toBeVisible();
    await expect(uppercaseToggle).toBeVisible();
    await expect(symbolsToggle).toBeVisible();
  });

  test('should show all buttons on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    await expect(refreshButton).toBeVisible();
    await expect(copyButton).toBeVisible();
    await expect(breachCheckButton).toBeVisible();
  });

  test('should show all buttons on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    await expect(refreshButton).toBeVisible();
    await expect(copyButton).toBeVisible();
    await expect(breachCheckButton).toBeVisible();
  });

  test('should show all buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    const copyButton = page.locator('[data-testid="copy-button"]');
    const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
    
    await expect(refreshButton).toBeVisible();
    await expect(copyButton).toBeVisible();
    await expect(breachCheckButton).toBeVisible();
  });

  test('should show theme toggle on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      await expect(themeToggle).toBeVisible();
    }
  });

  test('should show strength indicator on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const strengthIndicator = page.locator('[data-testid="strength-indicator"]');
      await expect(strengthIndicator).toBeVisible();
    }
  });

  test('should handle rapid viewport changes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('[data-testid="main-content"]');
    
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      await expect(mainContent).toBeVisible();
    }
  });

  test('should handle tab switching on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const passwordTab = page.locator('[data-testid="tab-password"]');
      const pinTab = page.locator('[data-testid="tab-pin"]');
      const passphraseTab = page.locator('[data-testid="tab-passphrase"]');
      
      await passwordTab.click();
      await page.waitForTimeout(300);
      
      await pinTab.click();
      await page.waitForTimeout(300);
      
      await passphraseTab.click();
      await page.waitForTimeout(300);
      
      // All tabs should still be visible
      await expect(passwordTab).toBeVisible();
      await expect(pinTab).toBeVisible();
      await expect(passphraseTab).toBeVisible();
    }
  });

  test('should handle button clicks on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const refreshButton = page.locator('[data-testid="refresh-button"]');
      const copyButton = page.locator('[data-testid="copy-button"]');
      
      await refreshButton.click();
      await page.waitForTimeout(300);
      
      await copyButton.click();
      await page.waitForTimeout(300);
      
      // Buttons should still be visible and clickable
      await expect(refreshButton).toBeVisible();
      await expect(copyButton).toBeVisible();
    }
  });

  test('should handle slider interactions on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const lengthSlider = page.locator('[data-testid="length-slider"]');
      
      await lengthSlider.click();
      await page.waitForTimeout(300);
      
      // Slider should still be visible and interactive
      await expect(lengthSlider).toBeVisible();
    }
  });

  test('should handle toggle interactions on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const digitToggle = page.locator('[data-testid="toggle-digits"]');
      
      await digitToggle.click();
      await page.waitForTimeout(300);
      
      // Toggle should still be visible and interactive
      await expect(digitToggle).toBeVisible();
    }
  });

  test('should handle theme toggle on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      
      await themeToggle.click();
      await page.waitForTimeout(300);
      
      // Theme toggle should still be visible and interactive
      await expect(themeToggle).toBeVisible();
    }
  });

  test('should handle breach check on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const breachCheckButton = page.locator('[data-testid="breach-check-button"]');
      
      await breachCheckButton.click();
      await page.waitForTimeout(2000);
      
      // Breach check button should still be visible
      await expect(breachCheckButton).toBeVisible();
    }
  });

  test('should handle password display on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
      { width: 320, height: 568 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      const passwordDisplay = page.locator('[data-testid="password-display"]');
      await expect(passwordDisplay).toBeVisible();
      
      const passwordText = await passwordDisplay.textContent();
      expect(passwordText).toBeTruthy();
    }
  });
});
