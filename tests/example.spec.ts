import { test, expect } from '@playwright/test';


// Reset database before each test
test.beforeEach(async ({ page }) => {
  await page.goto('https://c.hr.dmerej.info/reset_db');
  await page.getByRole('button', { name: 'Proceed' }).click();
});
