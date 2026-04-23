import { test, expect } from '@playwright/test';

// Reusable function to select dates from current date to user-selected end date
// If endDate is provided, selects it programmatically
// If endDate is null/undefined, waits for manual user selection
async function selectDatesFromCurrentToUserSelection(page, endDate = null) {
  // Use current date as check-in date
  const checkInDate = new Date();

  // Click on the date picker to open calendar
  await page.getByRole('textbox', { name: ' 1 night' }).click();

  // Format current date for Marriott's aria-label format
  const checkInLabel = formatDateForMarriott(checkInDate);

  // Select check-in date (current date)
  await page.getByLabel(checkInLabel).getByText(checkInDate.getDate().toString()).click();

  if (endDate) {
    // Programmatic selection
    const checkOutLabel = formatDateForMarriott(endDate);
    await page.getByLabel(checkOutLabel).getByText(endDate.getDate().toString()).click();
  } else {
    // Manual user selection mode
    console.log('Please manually select your desired check-out date from the calendar...');
    // Wait for user interaction (in real usage, this would be longer)
    await page.waitForTimeout(3000);
  }

  // Click Done button to confirm dates
  await page.getByRole('button', { name: 'Done' }).click();
}

// Helper function to format date for Marriott's aria-label
function formatDateForMarriott(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNumber = date.getDate();

  return `${dayName} ${monthName} ${dayNumber}`;
}


test('Select dates from current date to user selected date (manual interaction)', async ({ page }) => {
  
  await page.goto('https://www.marriott.com/default.mi');
  await page.waitForLoadState('load');
  // Function will select current date as check-in and wait for user to manually select check-out date
  // NOTE: This test requires manual user interaction to select the check-out date
  await selectDatesFromCurrentToUserSelection(page);

  // Click Find Hotels button to search
  await page.getByRole('button', { name: ' Find Hotels' }).click();

  // Wait for search results page to load by checking for a reliable element
  await page.waitForSelector('h1, [data-testid*="hotel"], .hotel-card, .search-results', { timeout: 30000 });
  expect(page.url()).toContain('search');

  console.log(`Selected dates from ${new Date().toDateString()} to user-selected date`);
});



