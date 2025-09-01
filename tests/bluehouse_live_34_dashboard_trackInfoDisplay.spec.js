import { test, expect } from '@playwright/test';
import { loginToMatrackDashboard } from './utils/new_login_dashboard_matrack_demorto';

test('Fuel Display Option and Validate API Response', async ({ page }) => {
  test.setTimeout(180000);

	await loginToMatrackDashboard(page);
	await page.waitForTimeout(5000);

	console.log('Navigating to User Settings...');
	const reportsMenu = page.locator('a:has-text("User Settings")');
	await reportsMenu.click();
	await page.waitForTimeout(2000);

	const allUnitStatusSelectors = [
		page.locator('#aChangeDisplayOptions').first(),
		page.getByRole('link', { name: 'Tracker Info Display Options' }),
		page.locator('a:has-text("Tracker Info Display Options")'),
	];

	let locationHistoryClicked = false;
	let response;
	for (const selector of allUnitStatusSelectors) {
		try {
		  await selector.waitFor({ state: 'visible', timeout: 5000 });
		  [response] = await Promise.all([
			page.waitForResponse(
			  res => res.url().includes('getInfoboxType.php'),
			  { timeout: 5000 }
			),
			selector.click(),
		  ]);
		  console.log('getting info display option value from API');
		  locationHistoryClicked = true;
		  break;
		} catch (e) {
		  console.log(`Selector failed: ${e.message}`);
		}
	}

	if (!locationHistoryClicked) {
	throw new Error('Failed to click info Display Option');
	}

	const rawText = await response.text();
	console.log('info type response:', rawText);
	await page.waitForTimeout(10000);

	// Extract the string value from the quoted response
	let infoType = rawText.trim();
	// Remove quotes if present (both single and double quotes)
	infoType = infoType.replace(/^["']|["']$/g, '').toLowerCase();
	console.log('extracted info type:', infoType);

	// if current info type is "5" then change to "4" else change to "5"
	if (infoType === "5") { //standard or regular
		console.log('clicking info type response - nameOnly');
		const nameOnlyRadio = page.locator('#divChangeDisplayOptions input[type="radio"][value="nameOnly"]');
		await nameOnlyRadio.waitFor({ state: 'visible', timeout: 10000 });
		await nameOnlyRadio.click();
		console.log('nameOnly radio button clicked successfully');
		await page.waitForTimeout(3000);
	} else {
		console.log('clicking info type response - Regular');
		const regularRadio = page.locator('#divChangeDisplayOptions input[type="radio"][value="regular"]');
		await regularRadio.waitFor({ state: 'visible', timeout: 10000 });
		await regularRadio.click();
		console.log('Regular radio button clicked successfully');
		await page.waitForTimeout(3000);
	}
	//expect(text).toBe('-7');
	await page.locator('#divChangeDisplayOptions .submit').click();
	// wait for 5 seconds
	await page.waitForTimeout(5000);
  
	const allUnitStatusSelectors2 = [
		page.locator('#aChangeDisplayOptions').first(),
		page.getByRole('link', { name: 'Tracker Info Display Options' }),
		page.locator('a:has-text("Tracker Info Display Options")'),
	];

	let locationHistoryClicked2 = false;
	let response2;
	for (const selector2 of allUnitStatusSelectors2) {
		try {
		  await selector2.waitFor({ state: 'visible', timeout: 5000 });
		  [response2] = await Promise.all([
			page.waitForResponse(
			  res => res.url().includes('updateInfoboxType.php'),
			  { timeout: 5000 }
			),
			selector2.click(),
		  ]);
		  console.log('getting info display option value from API');
		  locationHistoryClicked2 = true;
		  break;
		} catch (e) {
		  console.log(`Selector failed: ${e.message}`);
		}
	}
	
	const rawText2 = await response2.text();
	console.log('info type response:', rawText2);
	await page.waitForTimeout(5000);

	// Extract the string value from the quoted response
	let infoType2 = rawText2.status();
	// Remove quotes if present (both single and double quotes)
	//infoType2 = infoType2.replace(/^["']|["']$/g, '').toLowerCase();
	console.log('extracted info type:', infoType2);

	// if current info type is "5" then change to "4" else change to "5"
	if (infoType2 === infoType) { //standard or regular
		console.log('changes has not been saved, api error');
		
	}
	else{
		console.log('changes has been applied, api success');
	}
	
});
