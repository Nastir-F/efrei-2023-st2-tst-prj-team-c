import { test, expect } from '@playwright/test';


// Reset database before each test
test.beforeEach(async ({ page }) => {
  await page.goto('https://c.hr.dmerej.info/reset_db');
  await page.getByRole('button', { name: 'Proceed' }).click();
});

test('Promote to manager', async ({ page }) => {
  await page.goto('https://c.hr.dmerej.info/');
  await page.getByRole('link', { name: 'Add new employee' }).click();
  await page.getByPlaceholder('Name').fill('Name');
  await page.getByPlaceholder('Email').fill('test@email.com');
  await page.locator('#id_address_line1').fill('address');
  await page.getByPlaceholder('City').fill('Paris');
  await page.getByPlaceholder('Zip code').fill('75000');
  await page.getByPlaceholder('Hiring date').fill('2023-01-04');
  await page.getByPlaceholder('Job title').fill('Test job');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole('link', { name: 'List Employees' }).click();
  await expect(page.locator('table > tbody > tr:last-child > td:nth-child(3)')).toHaveText('no');
  await page.locator('table > tbody > tr:last-child > td:nth-child(4) > a').click();
  await page.getByRole('link', { name: 'Promote as manager' }).click();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await expect(page.locator('table > tbody > tr:last-child > td:nth-child(3)')).toHaveText('yes');
});
