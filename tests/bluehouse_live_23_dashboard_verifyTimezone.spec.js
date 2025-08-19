import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Verify Timezone using API Response', async ({ page }) => {
  test.setTimeout(120000);

  await loginToMatrackDashboard(page);
  await page.waitForTimeout(5000);

  console.log('Navigating to User Settings...');
  const reportsMenu = page.locator('a:has-text("User Settings")');
  await reportsMenu.click();
  await page.waitForTimeout(2000);

  const allUnitStatusSelectors = [
    page.locator('#aChangeTimezone').first(),
    page.getByRole('link', { name: 'Change Timezone' }),
    page.locator('a:has-text("Change Timezone")'),
  ];

  let locationHistoryClicked = false;
  let response;
  for (const selector of allUnitStatusSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      [response] = await Promise.all([
        page.waitForResponse(
          res => res.url().includes('getTimezone.php'),
          { timeout: 5000 }
        ),
        selector.click(),
      ]);
      console.log('Getting timzone value from an api');
      locationHistoryClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
    }
  }

  if (!locationHistoryClicked) {
    throw new Error('Failed to click Change Timezone');
  }

  const text = await response.text();
  console.log('Timezone response:', text);
  expect(text).toBe('-7');

  // wait for 5 seconds
  await page.waitForTimeout(5000);

});
