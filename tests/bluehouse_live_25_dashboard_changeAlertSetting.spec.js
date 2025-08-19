import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Validate Alert Setting using an API Response', async ({ page }) => {
  test.setTimeout(600000); // 10 minutes for the entire test

  await loginToMatrackDashboard(page);
  await page.waitForTimeout(30000);

  console.log('Navigating to User Settings...');
  const reportsMenu = page.locator('a:has-text("User Settings")');
  await reportsMenu.click();
  await page.waitForTimeout(30000);

  const allUnitStatusSelectors = [
    page.locator('#aChangeAlertSetting').first(),
    page.getByRole('link', { name: 'Change Alert Setting' }),
    page.locator('a:has-text("Change Alert Setting")'),
  ];


  let locationHistoryClicked = false;
  for (const selector of allUnitStatusSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 120000 });
      await selector.click();
      console.log('Clicked Change Alert Setting');
      locationHistoryClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
    }
  }

  if (!locationHistoryClicked) {
    throw new Error('Failed to click Change Alert Setting');
  }

  // ✅ Intercept the API call and capture the response
  const alertSettingsResponse = await page.waitForResponse(response =>
    response.url().includes('getAlertSettings.php') && response.request().method() === 'POST'
  );

  const json = await alertSettingsResponse.json();

  console.log('✅ Captured API Response:', JSON.stringify(json, null, 2));

  // ✅ Validate API data
  expect(Array.isArray(json)).toBeTruthy();
  const geofencingAlert = json.find(item => item.name === 'Geofencing Alert');
  expect(geofencingAlert).toBeDefined();
  expect(geofencingAlert.statusType).toBe('ON');

  // Additional validations can go here
  const speedAlert = json.find(item => item.name === 'Speed Alert');
  expect(speedAlert.speedlimit).toBe('62');

  // now want to change "low Battery Alert" if off then on else make it off 
  // const lowBatteryAlert = json.find(item => item.name === 'Low Battery Alert');
  // if (lowBatteryAlert.statusType === 'OFF') {
  //   await page.locator('#chk_20').getByRole('checkbox').check();
  //   await page.waitForTimeout(3000);
  // } else {
  //   await page.locator('#chk_20').getByRole('checkbox').uncheck();
  //   await page.waitForTimeout(3000);
  // }
  // Continue with visual checks or DOM validations if needed
  await page.locator('label').filter({ hasText: 'OnOffLow Battery Alert' }).getByRole('button').click();
  await page.locator('#divChangeAlert .submit').click();
  
  await page.waitForTimeout(10000);


  
});
