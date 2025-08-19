import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_rj';

test('Create Circular Geofence', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(120000); // 2 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(5000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Create Geofence...');
  
  // Try multiple selectors to find and click the Geofencing menu
  console.log('Attempting to click Geofencing menu...');
  const geofenceMenuSelectors = [
    page.locator('a:has-text("Geofencing")'),
    page.getByRole('link', { name: 'Geofencing' }),
    page.locator('#menuGeofencing'),
    page.locator('.nav-item:has-text("Geofencing")')
  ];

  let geofenceMenuClicked = false;
  for (const selector of geofenceMenuSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked Geofencing menu');
      geofenceMenuClicked = true;
      await page.waitForTimeout(2000); // Wait for menu animation
      break;
    } catch (e) {
      console.log(`Geofencing menu selector failed: ${e.message}`);
      continue;
    }
  }

  if (!geofenceMenuClicked) {
    throw new Error('Failed to click Geofencing menu');
  }
  
  // Then click on "Trip Report" link
  console.log('Clicking on Create Circular Geofence...');
  const createCircularGeofenceSelectors = [
    page.locator('#aGeofenceCreate').first(),
    page.getByRole('link', { name: 'Create Circular Geofence' }),
    page.locator('a:has-text("Create Circular Geofence")'),
  ];

  let createCircularGeofenceClicked = false;
  for (const selector of createCircularGeofenceSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked on Create Circular Geofence');
      createCircularGeofenceClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!createCircularGeofenceClicked) {
    throw new Error('Could not find or click Create Circular Geofence link');
  }

  // Wait for Create Circular Geofence page to load
  console.log('Waiting for Create Circular Geofence page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  // adding details to create LandMark
  await page.locator('#divCreateGeofence #txtCreateGeofenceAddress').fill('San Diego, CA, United States');
  //wait for 2 seconds and click on bottom arrow key to select the address from dropdown
  await page.waitForTimeout(2000);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');

  await page.locator('#divCreateGeofence #txtCreatefenceRadius').fill('350');
  await page.locator('#divCreateGeofence #txtCreatefenceName').fill('Test Geofence 1');

  await page.waitForTimeout(2000);
  // click on checkbox to select the LandMark under inventory
  //await page.locator('#divCreateGeofence #chkInventoryLandmark').click();

  await page.waitForTimeout(2000);
  // Generate LandMark Circle on map
  await page.locator('#divCreateGeofence #btnCreateGeofence').click();

  // add wait time of 5 seconds 
  await page.waitForTimeout(5000);
  
  
});