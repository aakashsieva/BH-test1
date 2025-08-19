import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Contact Email or SMS Alert', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(120000); // 2 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(5000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Contact Email or SMS Alert...');
  
  // Try multiple selectors to find and click the Geofencing menu
  console.log('Attempting to click Account Info menu...');
  const accountInfoMenuSelectors = [
    page.locator('a:has-text("Account Info")'),
    page.getByRole('link', { name: 'Account Info' }),
    page.locator('#menuAccountInfo'),
    page.locator('.nav-item:has-text("Account Info")')
  ];

  let accountInfoMenuClicked = false;
  for (const selector of accountInfoMenuSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked Account Info menu');
      accountInfoMenuClicked = true;
      await page.waitForTimeout(2000); // Wait for menu animation
      break;
    } catch (e) {
      console.log(`Account Info menu selector failed: ${e.message}`);
      continue;
    }
  }

  if (!accountInfoMenuClicked) {
    throw new Error('Failed to click Account Info menu');
  }
  
  // Then click on "Trip Report" link
  console.log('Clicking on Contact Email or SMS Alert...');
  const contactEmailorSMSAlertSelectors = [
    page.locator('.aAccInfoContacts').first(),
    page.getByRole('link', { name: 'Contact Email/SMS for Alerts' }),
    page.locator('a:has-text("Contact Email/SMS for Alerts")'),
  ];

  let contactEmailorSMSAlertClicked = false;
  for (const selector of contactEmailorSMSAlertSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked on Contact Email or SMS Alert');
      contactEmailorSMSAlertClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!contactEmailorSMSAlertClicked) {
    throw new Error('Could not find or click Contact Email or SMS Alert link');
  }

  // Wait for Contact Email or SMS Alert page to load
  console.log('Waiting for Contact Email or SMS Alert page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(10000); // Wait for menu animation
  
  
  await page.locator('#divContactList .editContNames').click();
  await page.waitForTimeout(2000);
  //removing one item from list
  await page.locator('#pViewContact_43').getByRole('checkbox').check();
  await page.waitForTimeout(3000);
  await page.locator('.EmailviewContact .removeContact').click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(3000);
  //adding one new item under list
  await page.getByRole('textbox', { name: 'New Email Id' }).click();
  await page.getByRole('textbox', { name: 'New Email Id' }).fill('sam.maze@yahoo.com');
  await page.getByRole('textbox', { name: 'New Email Id' }).press('Tab');
  await page.locator('#txtName').fill('Sam Maze');
  await page.locator('#btnAddEmail').click();
  await page.getByRole('button', { name: 'OK' }).click();
  
  await page.waitForTimeout(5000); // Wait for menu animation
  
});