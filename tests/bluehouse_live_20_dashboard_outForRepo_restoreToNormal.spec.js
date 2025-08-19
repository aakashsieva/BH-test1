import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Out For Repo', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(30000);

  // Navigate to Out For Repo with better error handling
  console.log('Attempting to navigate to Out For Repo...');
  
  // Then click on "All Unit Current Status" link
  console.log('Clicking Out For Repo...');
  const outForRepo = page.locator('.divVehiclesOutForRepoCard .btnView').first();
  await outForRepo.click();
  await page.waitForTimeout(10000);
  
  console.log('clicking on device name to expand the column and navigate to the "Restore to normal" button...');
  await page.getByRole('gridcell', { name: '+ Acct 9000 (861492067947959' }).click();
  await page.getByRole('link', { name: 'Restore To Normal' }).click();
  //await page.getByRole('row', { name: '+ Acct 9000 (861492067947959' }).getByRole('link', { name: 'Restore To Normal' }).click();
  // Wait for the element to be visible and clickable
  await page.locator('.swal2-popup .swal2-confirm').click();
  await page.waitForTimeout(10000);
  
});