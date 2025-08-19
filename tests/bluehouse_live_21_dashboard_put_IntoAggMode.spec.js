import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Put Into Aggressive Mode', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(600000); // 10 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(60000);

  // Navigate to Frequent Location with better error handling
  console.log('Attempting to navigate to Put Into Aggressive Mode...');
  
  // First hover over Reports menu to expand it
  console.log('Select Section of Put Into Aggressive Mode...');
  const frequentLocation = page.locator('.divAggressiveModeCard .select2-container').first();
  await frequentLocation.click();
  await page.waitForTimeout(20000); // Wait for menu animation
  
  // Wait for and interact with the search field
  const searchInput1 = page.locator('.select2-dropdown .select2-search__field').first();
  await searchInput1.waitFor({ state: 'visible', timeout: 60000 });
  await searchInput1.fill('862464065657244');
  await page.waitForTimeout(20000); // Wait for suggestions
  await searchInput1.press('Enter');
  console.log('added device IMEI - 862464065657244');

  await page.waitForTimeout(10000);

  // Generate report
  await page.locator('.divAggressiveModeCard').getByRole('button', { name: 'Submit' }).click();


  // add wait time of 10 seconds 
  await page.waitForTimeout(5000);
  console.log('selecting the checkbox to agree for puting device into agg mode');
  await page.locator('#divSendProgramming_Freq #warningPerHourAlert').click();
  //click on popup button where swal popup class and button class need to be used for click
  console.log('clicking on confirmation button to submit');
  await page.locator('#divSendProgramming_Freq .btnNormal_Freq').click();
  
  //add wait time of 10 seconds 
  await page.waitForTimeout(15000);
});