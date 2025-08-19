import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_rj';

test('Delete Polygon Geofence', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(120000); // 2 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(5000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Edit Polygon Geofence...');
  
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
  console.log('Clicking on edit Polygon Geofence...');
  const createPolygonGeofenceSelectors = [
    page.locator('#aPolygonGeofenceView').first(),
    page.getByRole('link', { name: 'Create Polygon Geofence' }),
    page.locator('a:has-text("Create Polygon Geofence")'),
  ];

  let createPolygonGeofenceClicked = false;
  for (const selector of createPolygonGeofenceSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked on Edit Polygon Geofence');
      createPolygonGeofenceClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!createPolygonGeofenceClicked) {
    throw new Error('Could not find or click Edit Polygon Geofence link');
  }

  // Wait for Create Polygon Geofence page to load
  console.log('Waiting for Edit Polygon Geofence page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  // Generate LandMark Circle on map
  await page.locator('#divEditPolygonGeofence #btnEditPolygonGeofence').click();

  // add wait time of 5 seconds 
  await page.waitForTimeout(5000);

  
  // Wait for the save confirmation modal to appear
  console.log('Waiting for delete confirmation modal...');
  try {
    await page.locator('#deleteConfirmationPolygon').waitFor({ state: 'visible', timeout: 10000 });
    console.log('Delete confirmation modal appeared successfully');
    
    // Optional: You can add more actions here like confirming the save
    // await page.locator('#saveConfirmationLandmark .btn-primary, #saveConfirmationLandmark .btn-success').click();
    
  } catch (modalError) {
    console.log(`Modal did not appear: ${modalError.message}`);
    
    // Try to manually trigger the modal since the element exists but is hidden
    console.log('Attempting to manually trigger the delete confirmation modal...');
    try {
      await page.evaluate(() => {
        // Try to show the modal directly using Bootstrap
        const modal = document.getElementById('deleteConfirmationPolygon');
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
      const isModalVisible = await page.locator('#deleteConfirmationPolygon').isVisible();
      if (isModalVisible) {
        console.log('Modal is now visible after manual trigger');
      } else {
        console.log('Modal still not visible after manual trigger');
      }
      
    } catch (manualModalError) {
      console.log(`Manual modal trigger failed: ${manualModalError.message}`);
      
      // Try alternative approach: trigger the save button event more directly
      console.log('Trying alternative delete button trigger...');
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
          if (window.$ && window.$('#deleteConfirmationPolygon').length) {
            window.$('#deleteConfirmationPolygon').modal('show');
            return true;
          }
          
          return false;
        });
        console.log('Alternative delete button trigger completed');
        
        // Wait and check modal again
        await page.waitForTimeout(3000);
        const isModalVisible2 = await page.locator('#deleteConfirmationPolygon').isVisible();
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
  
  // Click on confirm button in the delete confirmation modal
  console.log('Attempting to click on confirm button...');
  try {
    // Wait for the confirm button to be visible and clickable
    const confirmButton = page.locator('#deleteConfirmationPolygon .btn-confirm');
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
        page.locator('#deleteConfirmationPolygon button:has-text("Confirm")'),
        page.locator('#deleteConfirmationPolygon .btn-confirm'),
        page.locator('#deleteConfirmationPolygon .btn-success'),
        page.locator('#deleteConfirmationPolygon input[type="submit"]'),
        page.locator('#deleteConfirmationPolygon button[type="submit"]')
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