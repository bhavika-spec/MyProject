const { test, expect } = require('@playwright/test');
const bookingData = require('../MarriotData.json');

test.only('Select Marriott dates using JSON data', async ({ page }) => {

    
    await page.goto('https://www.marriott.com/default.mi');
    await page.waitForLoadState('load');

    for (const booking of bookingData.bookings) {
        if (booking.type === 'specific') {
            const today = new Date();
            today.setDate(today.getDate() + Number(booking.dayFromToday));

            const checkInDay = today.getDate();

            const checkOut = new Date(today);
            checkOut.setDate(checkOut.getDate() + Number(booking.nights));

            const checkOutDay = checkOut.getDate();

            // Open date picker
            await page.getByRole('textbox', { name: 'date-picker' }).first().click();
            //await page.locator('input[aria-label*="date"]').first().click();

            // Select Check-in Date
            await page.locator('button[aria-label*="${checkInDay}"]').first().click();

            // Select Check-out Date
            await page.locator('button[aria-label*="${checkOutDay}"]').first().click();

            // Apply dates
            await page.locator('button:has-text("Done")').click();
        } else if (booking.type === 'flexible') {
            // Open date picker
            await page.locator('input[aria-label*="date"]').first().click();

            // Navigate to the start month
            await page.locator('.react-calendar__navigation__label').click();
            await page.locator('.react-calendar__navigation__label').click(); // Go to year view
            await page.getByText(booking.startMonth).click();

            // Select first day of the month as check-in
            await page.locator('button[aria-label*="1"]').first().click();

            // Calculate check-out date
            const checkOutDate = new Date();
            checkOutDate.setMonth(checkOutDate.getMonth() + 1, 1); // First day of next month
            checkOutDate.setDate(checkOutDate.getDate() + Number(booking.nights) - 1);

            const checkOutDay = checkOutDate.getDate();

            // Select Check-out Date
            await page.locator(`button[aria-label*="${checkOutDay}"]`).first().click();

            // Apply dates
            await page.locator('button:has-text("Done")').click();
        }
    }

});