import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_BH';

test('Out For Repo', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Out For Repo with better error handling
  console.log('Attempting to navigate to Out For Repo...');
  
  // Then click on "All Unit Current Status" link
  console.log('Clicking Out For Repo...');
  const outForRepo = page.locator('.divVehiclesOutForRepoCard .btnView').first();
  await outForRepo.click();
  await page.waitForTimeout(20000);
  
  console.log('clicking on show locations button to navigate frequent locations table...');
  await page.getByRole('row', { name: '+ IMEI 860111051485872' }).getByRole('link', { name: 'Show Locations' }).click();
  // Wait for the element to be visible and clickable
  
  await page.waitForTimeout(10000);
  
});