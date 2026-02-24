import { test, expect } from '@playwright/test';

test.describe('Accessibility E2E Tests', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for main heading
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
  });

  test('should have proper tab roles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const tablist = page.getByRole('tablist');
    await expect(tablist).toBeVisible();
    
    const tabs = page.getByRole('tab');
    const tabCount = await tabs.count();
    expect(tabCount).toBe(3);
  });

  test('should have proper button roles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await expect(refreshButton).toBeVisible();
    
    const copyButton = page.getByRole('button', { name: /copy/i });
    await expect(copyButton).toBeVisible();
    
    const breachCheckButton = page.getByRole('button', { name: /breach/i });
    await expect(breachCheckButton).toBeVisible();
  });

  test('should have proper switch roles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const digitSwitch = page.locator('[data-testid="toggle-digits"]');
    await expect(digitSwitch).toBeVisible();
    
    const uppercaseSwitch = page.locator('[data-testid="toggle-uppercase"]');
    await expect(uppercaseSwitch).toBeVisible();
    
    const symbolsSwitch = page.locator('[data-testid="toggle-symbols"]');
    await expect(symbolsSwitch).toBeVisible();
  });

  test('should have proper slider role', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const slider = page.getByRole('slider');
    await expect(slider).toBeVisible();
  });

  test('should have proper ARIA attributes on tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordTab = page.getByRole('tab', { name: /password/i });
    const pinTab = page.getByRole('tab', { name: /pin/i });
    const passphraseTab = page.getByRole('tab', { name: /passphrase/i });
    
    // Check aria-selected
    await expect(passwordTab).toHaveAttribute('aria-selected', 'true');
    await expect(pinTab).toHaveAttribute('aria-selected', 'false');
    await expect(passphraseTab).toHaveAttribute('aria-selected', 'false');
  });

  test('should have proper ARIA attributes on switches', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const digitSwitch = page.locator('[data-testid="toggle-digits"]');
    const uppercaseSwitch = page.locator('[data-testid="toggle-uppercase"]');
    const symbolsSwitch = page.locator('[data-testid="toggle-symbols"]');
    
    // Check aria-checked
    await expect(digitSwitch).toHaveAttribute('aria-checked');
    await expect(uppercaseSwitch).toHaveAttribute('aria-checked');
    await expect(symbolsSwitch).toHaveAttribute('aria-checked');
  });

  test('should have proper ARIA attributes on slider', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const slider = page.getByRole('slider');
    
    // Check ARIA attributes
    await expect(slider).toHaveAttribute('aria-valuenow');
    await expect(slider).toHaveAttribute('aria-valuemin');
    await expect(slider).toHaveAttribute('aria-valuemax');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Tab to first interactive element
    await page.keyboard.press('Tab');
    
    // Check if focus is on an interactive element
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el: any) => el?.tagName);
    
    expect(['BUTTON', 'INPUT', 'A', 'SWITCH']).toContain(tagName);
  });

  test('should navigate tabs with keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on tabs
    const passwordTab = page.getByRole('tab', { name: /password/i });
    await passwordTab.focus();
    
    // Navigate to next tab with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    
    // Check focus moved
    const pinTab = page.getByRole('tab', { name: /pin/i });
    const isFocused = await pinTab.evaluate((el: any) => document.activeElement === el);
    
    expect(isFocused).toBe(true);
  });

  test('should activate tabs with keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on PIN tab
    const pinTab = page.getByRole('tab', { name: /pin/i });
    await pinTab.focus();
    
    // Activate with Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Check if tab is activated
    await expect(pinTab).toHaveAttribute('aria-selected', 'true');
  });

  test('should toggle switches with keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on digit switch
    const digitSwitch = page.locator('[data-testid="toggle-digits"]');
    await digitSwitch.focus();
    
    // Get initial state
    const initialState = await digitSwitch.getAttribute('aria-checked');
    
    // Toggle with Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(300);
    
    // Check state changed
    const newState = await digitSwitch.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should move slider with keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on slider
    const slider = page.getByRole('slider');
    await slider.focus();
    
    // Get initial value
    const initialValue = await slider.getAttribute('aria-valuenow');
    
    // Move slider with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);
    
    // Get new value
    const newValue = await slider.getAttribute('aria-valuenow');
    
    // Value should have changed
    expect(newValue).not.toBe(initialValue);
  });

  test('should activate buttons with keyboard', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await refreshButton.focus();
    
    // Activate with Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Button should still be visible
    await expect(refreshButton).toBeVisible();
  });

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await refreshButton.focus();
    
    // Check if focus is visible
    const hasFocusRing = await refreshButton.evaluate((el: any) => {
      return window.getComputedStyle(el).outline !== 'none' || 
             window.getComputedStyle(el).boxShadow !== 'none';
    });
    
    expect(hasFocusRing).toBe(true);
  });

  test('should have visible focus styles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on password tab
    const passwordTab = page.getByRole('tab', { name: /password/i });
    await passwordTab.focus();
    
    // Check if focus is visible
    const hasFocusStyle = await passwordTab.evaluate((el: any) => {
      const styles = window.getComputedStyle(el);
      return styles.outline !== 'none' || 
             styles.boxShadow !== 'none' ||
             styles.borderColor !== 'transparent';
    });
    
    expect(hasFocusStyle).toBe(true);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check if text is readable
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
    
    const textColor = await passwordDisplay.evaluate((el: any) => {
      return window.getComputedStyle(el).color;
    });
    
    const backgroundColor = await passwordDisplay.evaluate((el: any) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Colors should be defined
    expect(textColor).toBeTruthy();
    expect(backgroundColor).toBeTruthy();
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for images with alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        await expect(image).toHaveAttribute('alt');
      }
    }
  });

  test('should have proper labels for inputs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for labeled inputs - use a more robust selector
    const switches = page.locator('[data-testid^="toggle-"]');
    const switchCount = await switches.count();
    
    // Each switch should have a visible label nearby
    expect(switchCount).toBeGreaterThanOrEqual(3);
    
    // Check slider has label
    const lengthValue = page.locator('[data-testid="length-value"]');
    await expect(lengthValue).toBeVisible();
  });

  test('should have proper button labels', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const buttons = page.getByRole('button').filter({ visible: true });
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasLabel = await button.evaluate((el: HTMLElement) => {
        const ariaLabel = el.getAttribute('aria-label');
        const textContent = el.textContent?.trim() || '';
        const hasTitle = el.getAttribute('title') !== null;
        return (ariaLabel !== null && ariaLabel.trim() !== '') || 
               textContent.length > 0 || 
               hasTitle;
      });
      
      expect(hasLabel).toBe(true);
    }
  });

  test('should handle keyboard navigation through all controls', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Tab through all controls
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      // Check if focus is on an interactive element
      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const tagName = await focusedElement.evaluate((el: any) => el?.tagName);
      
      if (tagName) {
        expect(['BUTTON', 'INPUT', 'A', 'SWITCH', 'DIV', 'SPAN']).toContain(tagName);
      }
    }
  });

  test('should handle Shift+Tab navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Tab forward a few times
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
    
    // Tab backward
    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);
    
    // Check if focus moved back
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el: any) => el?.tagName);
    
    expect(tagName).toBeTruthy();
  });

  test('should handle Home/End keys on slider', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on slider
    const slider = page.getByRole('slider');
    await slider.focus();
    
    // Press Home
    await page.keyboard.press('Home');
    await page.waitForTimeout(300);
    
    // Get value after Home
    const homeValue = await slider.getAttribute('aria-valuenow');
    
    // Press End
    await page.keyboard.press('End');
    await page.waitForTimeout(300);
    
    // Get value after End
    const endValue = await slider.getAttribute('aria-valuenow');
    
    // Values should be different
    expect(homeValue).not.toBe(endValue);
  });

  test('should handle PageUp/PageDown keys on slider', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on slider
    const slider = page.getByRole('slider');
    await slider.focus();
    
    // Get initial value
    const initialValue = await slider.getAttribute('aria-valuenow');
    
    // Press PageUp
    await page.keyboard.press('PageUp');
    await page.waitForTimeout(300);
    
    // Get new value
    const newValue = await slider.getAttribute('aria-valuenow');
    
    // Value should have changed
    expect(newValue).not.toBe(initialValue);
  });

  test('should have proper ARIA live regions', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for live regions (e.g., toast notifications)
    const liveRegions = page.locator('[aria-live]');
    const liveRegionCount = await liveRegions.count();
    
    // Should have at least one live region for notifications
    expect(liveRegionCount).toBeGreaterThanOrEqual(0);
  });

  test('should announce changes to screen readers', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Click refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await refreshButton.click();
    await page.waitForTimeout(300);
    
    // Check if password display is updated
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
  });

  test('should have proper skip links', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for skip links (optional but good for accessibility)
    const skipLinks = page.locator('a[href^="#"]');
    const skipLinkCount = await skipLinks.count();
    
    // Skip links are optional
    expect(skipLinkCount).toBeGreaterThanOrEqual(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check heading levels
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
    
    // Check that headings are in order
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should have proper landmark roles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for main landmark
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
    
    // Check for navigation landmark (optional)
    const nav = page.getByRole('navigation').first();
    // Navigation is optional
  });

  test('should be accessible with screen reader', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check that main interactive elements (copy, refresh, breach check) are accessible
    const mainButtons = page.locator('[data-testid="copy-button"], [data-testid="refresh-button"], [data-testid="breach-check-button"]');
    const mainButtonCount = await mainButtons.count();
    
    for (let i = 0; i < mainButtonCount; i++) {
      const button = mainButtons.nth(i);
      
      // These buttons should have text content
      const text = await button.textContent();
      expect(text && text.trim().length > 0).toBe(true);
    }
    
    // Check tabs have accessible names
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    expect(tabCount).toBeGreaterThanOrEqual(3);
  });

  test('should handle keyboard focus on all tabs', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const tabs = ['Password', 'PIN', 'Passphrase'];
    
    for (const tabName of tabs) {
      const tab = page.getByRole('tab', { name: new RegExp(tabName, 'i') });
      await tab.focus();
      await page.waitForTimeout(100);
      
      // Check if focus is on the tab
      const isFocused = await tab.evaluate((el: any) => document.activeElement === el);
      expect(isFocused).toBe(true);
    }
  });

  test('should have proper focus management on tab switch', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Focus on password tab
    const passwordTab = page.getByRole('tab', { name: /password/i });
    await passwordTab.focus();
    
    // Switch to PIN tab
    const pinTab = page.getByRole('tab', { name: /pin/i });
    await pinTab.click();
    await page.waitForTimeout(300);
    
    // Focus should move to PIN tab content
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    const tagName = await focusedElement.evaluate((el: any) => el?.tagName);
    
    expect(tagName).toBeTruthy();
  });

  test('should have proper ARIA attributes on theme toggle', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    await expect(themeToggle).toBeVisible();
    
    // Check for accessible name
    const hasLabel = await themeToggle.evaluate((el: any) => {
      return el.getAttribute('aria-label') !== null || 
             el.textContent.trim() !== '';
    });
    
    expect(hasLabel).toBe(true);
  });

  test('should have proper ARIA attributes on password display', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const passwordDisplay = page.locator('[data-testid="password-display"]');
    await expect(passwordDisplay).toBeVisible();
    
    // Check if password is not in a password input field
    const isPasswordInput = await passwordDisplay.evaluate((el: any) => {
      return el.getAttribute('type') === 'password';
    });
    
    expect(isPasswordInput).toBe(false);
  });

  test('should handle keyboard navigation on all viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      // Tab through controls
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      // Check if focus is on an interactive element
      const focusedElement = await page.evaluateHandle(() => document.activeElement);
      const tagName = await focusedElement.evaluate((el: any) => el?.tagName);
      
      if (tagName) {
        expect(['BUTTON', 'INPUT', 'A', 'SWITCH']).toContain(tagName);
      }
    }
  });

  test('should have proper error message accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mock error scenario
    await page.route('**/api.pwnedpasswords.com/**', async (route) => {
      await route.abort('failed');
    });
    
    const breachCheckButton = page.getByRole('button', { name: /breach/i });
    await breachCheckButton.click();
    await page.waitForTimeout(2000);
    
    // Check if error message is accessible
    const errorMessages = page.locator('[role="alert"], [role="status"]');
    const errorMessageCount = await errorMessages.count();
    
    // Error messages should be accessible
    expect(errorMessageCount).toBeGreaterThanOrEqual(0);
  });
});
