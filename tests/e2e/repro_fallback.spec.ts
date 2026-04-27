import { test, expect } from '@playwright/test';

test('verify current behavior - should show fallback', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  await page.goto('/tutor-dashboard');
  
  // Wait for button to be enabled
  const button = page.getByRole('button', { name: 'Generate Gemini analysis' });
  await expect(button).toBeEnabled({ timeout: 30000 });
  
  // Fill in required fields
  await page.locator('#sessionImage').setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR42mP8/xwAAuEB78vzFwAAAABJRU5ErkJggg==', 'base64')
  });
  await page.getByLabel('Transcript').fill('Student: I am confused about slope.');
  
  // Click button
  await button.click();
  
  // Wait for result
  await expect(page.getByText('Demo fallback')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('Fallback analysis is being shown because no Gemini API key was provided.')).toBeVisible();
});
