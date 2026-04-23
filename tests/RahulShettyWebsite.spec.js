import { test, expect } from '@playwright/test';

test('Login to Rahul shetty academy', async ({ page }) => {

  const email="baby.usa25@gmail.com";
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill("Newborn@2026");
  await page.locator('#login').click();
  const productTitle = await page.locator('.card-body b').nth(0).textContent();
  console.log(productTitle);
  
});