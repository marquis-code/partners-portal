import { test, expect } from '@playwright/test';

// test('Testing signup flow first step', async ({ page }) => {
//   await page.goto('http://localhost:8080/register')
//   await page.locator('#first-name').fill('maczeess')
//   await page.locator('#last-name').fill('maczeess')
//   await page.locator('#email-address').fill('maczeess@mailinator.com')
//   await page.locator('#phone').fill('09034563479')
//   await page.locator('#password-register').fill('maczeess')
//   await Promise.all([
//     page.waitForNavigation(), // Wait for the next page to load
//     await page.getByRole('button', {name: "Register"}).click() // Replace with your submit button selector
//   ]);
//   await page.goto('https://partners.shuttlers.africa/get-started?type=individual')
// });

test('Testing kyc flow', async ({ page }) => {
  // await page.goto('http://localhost:8080/login')
  // await page.locator('[type="email"]').fill('germa@gmail.com')
  // await page.locator('[type="password"]').fill('german')
  // await page.getByRole('button', { name: 'Login'}).click()
  // await Promise.all([
  //   page.waitForNavigation(),
  //   await page.goto('https://partners.shuttlers.africa/get-started?type=individual')
  // ])
  await page.goto('https://partners.shuttlers.africa/get-started?type=individual')
  await page.getByLabel('Means of Identification').selectOption('NIN');
  await page.getByLabel('Document ID').fill('23456789763')
  const datePicker = page.locator('.vc-popover-content-wrapper > .vc-popover-content')
  await datePicker.click()
  await datePicker.fill('25-01-2024')
  await page.getByRole('button', { name: 'Next'})
})
