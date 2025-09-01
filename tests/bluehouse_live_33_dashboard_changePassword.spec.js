import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Change Password', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(180000); // 8 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(30000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to change password...');
  
  // Try multiple selectors to find and click the Geofencing menu
  console.log('Attempting to click Admin Settings...');
  const accountInfoMenuSelectors = [
    page.locator('a:has-text("Admin Settings")'),
    page.getByRole('link', { name: 'Admin Settings' }),
    page.locator('.nav-item:has-text("Admin Settings")')
  ];

  let accountInfoMenuClicked = false;
  for (const selector of accountInfoMenuSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 10000 });
      await selector.click();
      console.log('Successfully clicked Admin Settings menu');
      accountInfoMenuClicked = true;
      await page.waitForTimeout(10000); // Wait for menu animation
      break;
    } catch (e) {
      console.log(`Admin Settings menu selector failed: ${e.message}`);
      continue;
    }
  }

  if (!accountInfoMenuClicked) {
    throw new Error('Failed to click Admin Settings menu');
  }
  
  console.log('Clicking on Change Password...');
  const viewListedTrackersSelectors = [
    page.locator('#aChangePassword').first(),
    page.getByRole('link', { name: 'Change Password' }),
    page.locator('a:has-text("Change Password")'),
  ];

  let viewListedTrackersClicked = false;
  for (const selector of viewListedTrackersSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 10000 });
      await selector.click();
      console.log('Successfully clicked on Change Password');
      viewListedTrackersClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!viewListedTrackersClicked) {
    throw new Error('Could not find or click View Listed Trackers link');
  }
  
  await page.locator('#divChangePwd #txtOldPwd').fill('Hello@2024');
  await page.waitForTimeout(2000);
  await page.locator('#divChangePwd #txtNewPwd').fill('Hello@2025');
  await page.waitForTimeout(2000);
  await page.locator('#divChangePwd #txtConfirmPwd').fill('Hello@2025');
  await page.waitForTimeout(2000);
  await page.locator('#divChangePwd #btnChangePassword').click();
  await page.waitForTimeout(5000);

  console.log('Verifying password change success message...');
  const resultElement = page.locator('#divChangePwd #pChangePwdResult');
  await expect(resultElement).toBeVisible();
  
  const style = await resultElement.evaluate(el => window.getComputedStyle(el).display);
  expect(style).not.toBe('none');

  const message = await resultElement.textContent();
  console.log('current message:', message);
  expect(message).toBe('Password changed successfully.');
  console.log('Successfully verified password change message');
	
});