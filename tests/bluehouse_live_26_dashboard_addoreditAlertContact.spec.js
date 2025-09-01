import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Add or Edit Alert Contacts', async ({ page }) => {
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
    page.locator('a:has-text("Admin Settings")'),
    page.getByRole('link', { name: 'Admin Settings' }),
    //page.locator('#aAddEditAlert'),
    page.locator('.nav-item:has-text("Admin Settings")')
  ];

  let accountInfoMenuClicked = false;
  for (const selector of accountInfoMenuSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked Admin Settings menu');
      accountInfoMenuClicked = true;
      await page.waitForTimeout(2000); // Wait for menu animation
      break;
    } catch (e) {
      console.log(`Admin Settings menu selector failed: ${e.message}`);
      continue;
    }
  }

  if (!accountInfoMenuClicked) {
    throw new Error('Failed to click Admin Settings menu');
  }
  
  // Then click on "Trip Report" link
  console.log('Clicking on Add/Edit Alert Contacts...');
  const contactEmailorSMSAlertSelectors = [
    page.locator('#aAddEditAlert').first(),
    page.getByRole('link', { name: 'Add/Edit Alert Contacts' }),
    page.locator('a:has-text("Add/Edit Alerts Contacts")'),
  ];

  let contactEmailorSMSAlertClicked = false;
  for (const selector of contactEmailorSMSAlertSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked on Add/Edit Alerts Contacts');
      contactEmailorSMSAlertClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!contactEmailorSMSAlertClicked) {
    throw new Error('Could not find or click Add/Edit Alerts Contacts link');
  }

  // Wait for Contact Email or SMS Alert page to load
  console.log('Waiting for Add/Edit Alerts Contacts page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(10000); // Wait for menu animation
  
  //removing one item from list
  await page.locator('#pViewContact_48').getByRole('checkbox').check();
  await page.waitForTimeout(3000);
  await page.locator('.divSMS .removeContact').click();
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(3000);
  //adding one new item under list
  await page.getByText('T-Mobile').click();
  await page.getByRole('textbox', { name: 'New SMS Contact' }).click();
  await page.getByRole('textbox', { name: 'New SMS Contact' }).fill('9958184653');
  await page.getByRole('textbox', { name: 'New SMS Contact' }).press('Tab');
  await page.locator('#txtSmsName').fill('Sam Maze');
  await page.locator('#btnAddSMS').click();
  await page.getByRole('button', { name: 'OK' }).click();
  
  await page.waitForTimeout(10000); // Wait for menu animation
  
});