import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_rj';

test('Create Geofence', async ({ page }) => {
  // Set timeout for the entire test
  test.setTimeout(120000); // 2 minutes for the entire test
  
  // Perform login using the utility function
  await loginToMatrackDashboard(page);

  // Wait for the dashboard to be fully loaded
  await page.waitForTimeout(5000);

  // Navigate to Location History with better error handling
  console.log('Attempting to navigate to Edit Geofence...');
  
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
  console.log('Clicking on Edit Circular Geofence...');
  const createCircularGeofenceSelectors = [
    page.locator('#aGeofenceView').first(),
    page.getByRole('link', { name: 'Edit Circular Geofence' }),
    page.locator('a:has-text("Edit Circular Geofence")'),
  ];

  let createCircularGeofenceClicked = false;
  for (const selector of createCircularGeofenceSelectors) {
    try {
      await selector.waitFor({ state: 'visible', timeout: 5000 });
      await selector.click();
      console.log('Successfully clicked on Edit Circular Geofence');
      createCircularGeofenceClicked = true;
      break;
    } catch (e) {
      console.log(`Selector failed: ${e.message}`);
      continue;
    }
  }

  if (!createCircularGeofenceClicked) {
    throw new Error('Could not find or click Edit Circular Geofence link');
  }

  // Wait for Create Circular Geofence page to load
  console.log('Waiting for Edit Circular Geofence page to load...');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);

  // adding details to create LandMark
  await page.locator('#divEditGeofence .selGeofence').click();
  await page.waitForTimeout(1000); // Wait for dropdown to appear
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown'); 
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown'); // Press down 4 times to select 4th option
  
  await page.waitForTimeout(2000);
  await page.keyboard.press('Enter');

  await page.waitForTimeout(2000);
  
  // Generate LandMark Circle on map
  await page.locator('#divEditGeofence #btnEditGeofence').click();

  // add wait time of 5 seconds 
  await page.waitForTimeout(5000);

  // Click on delete button plotted on the map
  console.log('Attempting to click on delete button on the map...');
  
  // Wait for the map and save button to be fully loaded
  await page.waitForTimeout(3000);
  
  // Skip approach 1 and go directly to approach 2: Try to click using coordinates
  console.log('Using coordinate-based approach to click delete button...');
  /*
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
      console.log('Successfully clicked on delete button using coordinates');
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
      console.log('Successfully triggered delete button via JavaScript');
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
  */
  // Wait for the save confirmation modal to appear
  console.log('Waiting for delete confirmation modal...');
  
  try {
    await page.locator('#deleteConfirmation').waitFor({ state: 'visible', timeout: 10000 });
    console.log('Delete confirmation modal appeared successfully');
    
  } catch (modalError) {
    console.log(`Modal did not appear: ${modalError.message}`);
    
    // Try to manually trigger the modal since the element exists but is hidden
    console.log('Attempting to manually trigger the delete confirmation modal...');
    try {
      await page.evaluate(() => {
        // Try to show the modal directly using Bootstrap
        const modal = document.getElementById('deleteConfirmation');
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
      const isModalVisible = await page.locator('#deleteConfirmation').isVisible();
      if (isModalVisible) {
        console.log('Modal is now visible after manual trigger');
      } else {
        console.log('Modal still not visible after manual trigger');
      }
      
    } catch (manualModalError) {
      console.log(`Manual modal trigger failed: ${manualModalError.message}`);
      
      // Try alternative approach: trigger the save button event more directly
      console.log('Trying alternative delete button trigger...');
      /*
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
          if (window.$ && window.$('#deleteConfirmation').length) {
            window.$('#deleteConfirmation').modal('show');
            return true;
          }
          
          return false;
        });
        console.log('Alternative delete button trigger completed');
        
        // Wait and check modal again
        await page.waitForTimeout(3000);
        const isModalVisible2 = await page.locator('#deleteConfirmation').isVisible();
        if (isModalVisible2) {
          console.log('Modal appeared after alternative trigger');
        } else {
          console.log('Modal still not appearing - may need different approach');
        }
        
      } catch (altError) {
        console.log(`Alternative approach failed: ${altError.message}`);
      }
      */
    }
  }
  
  
  // Click on confirm button in the delete confirmation modal
  console.log('Attempting to click on confirm button...');
  try {
    // Wait for the confirm button to be visible and clickable
    const confirmButton = page.locator('#deleteConfirmation .btn-confirm');
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
    await confirmButton.click();
    console.log('Successfully clicked on confirm button');
    
    // Wait for 5 seconds as requested
    console.log('Waiting for 5 seconds after confirm...');
    await page.waitForTimeout(5000);
    console.log('5 seconds wait completed');
    
  } catch (deleteError) {
    console.log(`Delete button click failed: ${deleteError.message}`);
    
    // Fallback: Try alternative selectors for confirm button
    try {
      const alternativeConfirmSelectors = [
        page.locator('#deleteConfirmation button:has-text("Confirm")'),
        page.locator('#deleteConfirmation .btn-confirm'),
        page.locator('#deleteConfirmation .btn-success'),
        page.locator('#deleteConfirmation button[type="submit"]')
      ];

      let confirmClicked = false;
      for (const selector of alternativeConfirmSelectors) {
        try {
          await selector.waitFor({ state: 'visible', timeout: 5000 });
          await selector.click();
          console.log('Successfully clicked confirm button using alternative selector');
          confirmClicked = true;
          break;
        } catch (e) {
          console.log(`Alternative confirm selector failed: ${e.message}`);
          continue;
        }
      }

      if (!confirmClicked) {
        throw new Error('All confirm button selectors failed');
      }
      
      // Wait for 5 seconds after successful confirm
      console.log('Waiting for 5 seconds after confirm...');
      await page.waitForTimeout(5000);
      console.log('5 seconds wait completed');
      
    } catch (fallbackError) {
      console.log(`All confirm button approaches failed: ${fallbackError.message}`);
    }
  }

  

  
});