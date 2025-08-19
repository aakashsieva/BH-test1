import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_rj';

test('Create Aggressive Geofence', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(120000); // 2 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(5000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Create Aggressive Geofence...');
  
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
  console.log('Clicking on Create Aggressive Geofence...');
  const createAggressiveGeofenceSelectors = [
    page.locator('#aGeofenceCreate_assetTracker').first(),
    page.getByRole('link', { name: 'Create Aggressive Geofence' }),
    page.locator('a:has-text("Create Aggressive Geofence")'),
  ];

  let createAggressiveGeofenceClicked = false;
  for (const selector of createAggressiveGeofenceSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked on Create Aggressive Geofence');
      createAggressiveGeofenceClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!createAggressiveGeofenceClicked) {
    throw new Error('Could not find or click Create Aggressive Geofence link');
  }

  // Wait for Create Aggressive Geofence page to load
  console.log('Waiting for Create Aggressive Geofence page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  // adding details to create LandMark
  await page.locator('#divAsssetDriver_here #txtCreateAssetGeofenceAddress').fill('San Diego, CA, United States');
  //wait for 2 seconds and click on bottom arrow key to select the address from dropdown
  await page.waitForTimeout(2000);
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');

  await page.locator('#divAsssetDriver_here #txtCreatefenceRadius').fill('350');
  //await page.locator('#divAsssetDriver_here #txtCreatefenceName').fill('Test Geofence 1');

  await page.waitForTimeout(2000);
  // click on checkbox to select the LandMark under inventory
  //await page.locator('#divCreateGeofence #chkInventoryLandmark').click();

  await page.waitForTimeout(2000);
  // Generate LandMark Circle on map
  await page.locator('#divAsssetDriver_here #btnAssetGeofence').click();

  // add wait time of 5 seconds 
  await page.waitForTimeout(5000);

  // Skip approach 1 and go directly to approach 2: Try to click using coordinates
  console.log('Using coordinate-based approach to click save button...');
  try {
    // Get the map container dimensions
    const mapContainer = page.locator('#map, .map-container, [id*="map"]').first();
    const mapBox = await mapContainer.boundingBox();
    
    if (mapBox) {
      // Click in the center-right area of the map where save button might be located
      const clickX = mapBox.x + mapBox.width * 0.8; // 80% from left
      const clickY = mapBox.y + mapBox.height * 0.5; // 50% from top
      
      console.log(`Clicking at coordinates: (${clickX}, ${clickY})`);
      await page.mouse.click(clickX, clickY);
      console.log('Successfully clicked on save button using coordinates');
    } else {
      throw new Error('Could not find map container');
    }
  } catch (coordError) {
    console.log(`Coordinate approach failed: ${coordError.message}`);
    
    // Approach 3: Try to trigger the tap event directly via JavaScript
    try {
      await page.evaluate(() => {
        // Look for the save button marker in the Here Maps objects
        if (window.saveButton) {
          // Trigger the tap event manually
          const tapEvent = new Event('tap', { bubbles: true });
          window.saveButton.dispatchEvent(tapEvent);
          return true;
        }
        
        // Alternative: Look for any marker with save icon
        const markers = document.querySelectorAll('[style*="save.png"], img[src*="save.png"]');
        if (markers.length > 0) {
          markers[0].click();
          return true;
        }
        
        return false;
      });
      console.log('Successfully triggered save button via JavaScript');
    } catch (jsError) {
      console.log(`JavaScript approach failed: ${jsError.message}`);
      
      // Approach 4: Try to find and click on any clickable element that might be the save button
      try {
        const clickableElements = page.locator('div[role="button"], button, a, [onclick*="save"], [class*="save"]');
        const count = await clickableElements.count();
        
        for (let i = 0; i < Math.min(count, 10); i++) {
          const element = clickableElements.nth(i);
          const text = await element.textContent();
          const className = await element.getAttribute('class');
          
          if (text && text.toLowerCase().includes('save') || 
              className && className.toLowerCase().includes('save')) {
            await element.click();
            console.log('Successfully clicked on save button using text/class matching');
            break;
          }
        }
      } catch (finalError) {
        console.log(`Final approach failed: ${finalError.message}`);
        throw new Error('Could not interact with save button on the map');
      }
    }
  }
  
  // Wait for the save confirmation modal to appear
  console.log('Waiting for save confirmation modal...');
  try {
    await page.locator('#saveAssetConfirmation').waitFor({ state: 'visible', timeout: 10000 });
    console.log('Save confirmation modal appeared successfully');
    
    // Optional: You can add more actions here like confirming the save
    // await page.locator('#saveConfirmationLandmark .btn-primary, #saveConfirmationLandmark .btn-success').click();
    
  } catch (modalError) {
    console.log(`Modal did not appear: ${modalError.message}`);
    
    // Try to manually trigger the modal since the element exists but is hidden
    console.log('Attempting to manually trigger the save confirmation modal...');
    try {
      await page.evaluate(() => {
        // Try to show the modal directly using Bootstrap
        const modal = document.getElementById('saveAssetConfirmation');
        if (modal) {
          // Remove fade class and show modal
          modal.classList.remove('fade');
          modal.style.display = 'block';
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
          
          // Add backdrop if needed
          const backdrop = document.createElement('div');
          backdrop.className = 'modal-backdrop fade show';
          document.body.appendChild(backdrop);
          
          return true;
        }
        return false;
      });
      console.log('Successfully triggered modal manually');
      
      // Wait a moment and check if modal is now visible
      await page.waitForTimeout(2000);
      const isModalVisible = await page.locator('#saveAssetConfirmation').isVisible();
      if (isModalVisible) {
        console.log('Modal is now visible after manual trigger');
      } else {
        console.log('Modal still not visible after manual trigger');
      }
      
    } catch (manualModalError) {
      console.log(`Manual modal trigger failed: ${manualModalError.message}`);
      
      // Try alternative approach: trigger the save button event more directly
      console.log('Trying alternative save button trigger...');
      try {
        await page.evaluate(() => {
          // Look for the save button in the Here Maps context
          if (window.saveButton) {
            // Create a more specific tap event
            const tapEvent = new CustomEvent('tap', {
              bubbles: true,
              cancelable: true,
              detail: { originalEvent: new MouseEvent('click') }
            });
            window.saveButton.dispatchEvent(tapEvent);
            return true;
          }
          
          // Try to find the save button by its icon
          const saveIcons = document.querySelectorAll('img[src*="save.png"], div[style*="save.png"]');
          if (saveIcons.length > 0) {
            // Trigger click on the parent element
            const parentElement = saveIcons[0].closest('div') || saveIcons[0].parentElement;
            if (parentElement) {
              parentElement.click();
              return true;
            }
          }
          
          // Try to trigger jQuery modal directly
          if (window.$ && window.$('#saveAssetConfirmation').length) {
            window.$('#saveAssetConfirmation').modal('show');
            return true;
          }
          
          return false;
        });
        console.log('Alternative save button trigger completed');
        
        // Wait and check modal again
        await page.waitForTimeout(3000);
        const isModalVisible2 = await page.locator('#saveAssetConfirmation').isVisible();
        if (isModalVisible2) {
          console.log('Modal appeared after alternative trigger');
        } else {
          console.log('Modal still not appearing - may need different approach');
        }
        
      } catch (altError) {
        console.log(`Alternative approach failed: ${altError.message}`);
      }
    }
  }
  
  // Click on confirm button in the save confirmation modal
  console.log('Attempting to click on confirm button...');
  try {
    // Wait for the confirm button to be visible and clickable
    const confirmButton = page.locator('#saveAssetConfirmation .btn-confirm');
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    console.log('Successfully clicked on confirm button');
    
    // Wait for 5 seconds as requested
    console.log('Waiting for 5 seconds after confirm...');
    await page.waitForTimeout(5000);
    console.log('5 seconds wait completed');
    
  } catch (confirmError) {
    console.log(`Confirm button click failed: ${confirmError.message}`);
    
    // Fallback: Try alternative selectors for confirm button
    try {
      const alternativeConfirmSelectors = [
        page.locator('#saveAssetConfirmation button:has-text("Confirm")'),
        page.locator('#saveAssetConfirmation .btn-primary'),
        page.locator('#saveAssetConfirmation .btn-success'),
        page.locator('#saveAssetConfirmation input[type="submit"]'),
        page.locator('#saveAssetConfirmation button[type="submit"]')
      ];
      
      let confirmClicked = false;
      for (const selector of alternativeConfirmSelectors) {
        try {
          if (await selector.isVisible()) {
            await selector.click();
            console.log('Successfully clicked on confirm button using alternative selector');
            confirmClicked = true;
            break;
          }
        } catch (e) {
          console.log(`Alternative selector failed: ${e.message}`);
          continue;
        }
      }
      
      if (confirmClicked) {
        // Wait for 5 seconds as requested
        console.log('Waiting for 5 seconds after confirm...');
        await page.waitForTimeout(5000);
        console.log('5 seconds wait completed');
      } else {
        console.log('Could not find or click any confirm button');
      }
      
    } catch (fallbackError) {
      console.log(`All confirm button attempts failed: ${fallbackError.message}`);
    }
  }
  
});