import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Frequent Location', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Frequent Location with better error handling
  console.log('Attempting to navigate to Frequent Location...');
  
  // First hover over Reports menu to expand it
  console.log('Select Section of Frequent Location...');
  const frequentLocation = page.locator('.divOutForRepoCard .select2-container').first();
  await frequentLocation.click();
  await page.waitForTimeout(60000); // Wait for menu animation
  
  // Wait for and interact with the search field
  const searchInput1 = page.locator('.select2-dropdown .select2-search__field').first();
  await searchInput1.waitFor({ state: 'visible', timeout: 60000 });
  await searchInput1.fill('861492067898038');
  await page.waitForTimeout(60000); // Wait for suggestions
  await searchInput1.press('Enter');
  console.log('added device IMEI - 861492067898038');

  await page.waitForTimeout(60000);

  // Generate report
  await page.locator('.divOutForRepoCard').getByRole('button', { name: 'Submit' }).click();


  // add wait time of 10 seconds 
  await page.waitForTimeout(5000);
  
  //click on popup button where swal popup class and button class need to be used for click
  await page.locator('.swal2-popup .swal2-confirm').click();
  await page.waitForTimeout(5000);

  await page.locator('#divOutForRepoModal .close').click();
  //add wait time of 10 seconds 
  await page.waitForTimeout(10000);
});