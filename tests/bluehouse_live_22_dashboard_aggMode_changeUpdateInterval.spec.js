import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Out From Agg Mode', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(30000);

  // Navigate to Out For Repo with better error handling
  console.log('Attempting to navigate to Out from agg mode...');
  
  // Then click on "All Unit Current Status" link
  console.log('Clicking Out from agg mode...');
  const outForRepo = page.locator('.divVehicleInAggressiveMode .btnView').first();
  await outForRepo.click();
  await page.waitForTimeout(10000);
  
  console.log('clicking on device name to expand the column and navigate to the "Change Interval" button...');
  await page.getByRole('gridcell', { name: '+ ACCT 123456' }).click();
  await page.getByRole('link', { name: 'Change Interval' }).click();
  //await page.getByRole('row', { name: '+ Acct 9000 (861492067947959' }).getByRole('link', { name: 'Restore To Normal' }).click();
  // Wait for the element to be visible and clickable
  //select 2nd option from the dropdown or select 2 ping per day
  await page.locator('#selPingFreq').selectOption('2');
  await page.waitForTimeout(10000);
  await page.locator('#divSendProgramming_Freq .btnNormal_Freq').click();
  //await page.locator('.swal2-popup .swal2-confirm').click();
  await page.waitForTimeout(10000);
  
});