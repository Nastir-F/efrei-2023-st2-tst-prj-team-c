import { test, expect } from "@playwright/test";

// Reset database before each test
test.beforeEach(async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/reset_db");
  await page.getByRole("button", { name: "Proceed" }).click();
});

test("Should create a user", async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/");
  await page.getByRole("link", { name: "Add new employee" }).click();
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill("Tristan FIEVET");
  await page.getByPlaceholder("Name").press("Tab");
  await page.getByPlaceholder("Email").fill("tristan@tristan.com");
  await page.getByPlaceholder("Email").press("Tab");
  await page.locator("#id_address_line1").fill("adresse1");
  await page.locator("#id_address_line1").press("Tab");
  await page.locator("#id_address_line2").fill("adresse2");
  await page.locator("#id_address_line2").press("Tab");
  await page.getByPlaceholder("City").fill("ville1");
  await page.getByPlaceholder("City").press("Tab");
  await page.getByPlaceholder("Zip code").fill("94000");
  await page.getByPlaceholder("Zip code").press("Tab");
  await page.getByPlaceholder("Hiring date").fill("2222-12-22");
  await page.getByPlaceholder("Hiring date").press("Tab");
  await page.getByPlaceholder("Job title").fill("CEO");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator('table > tbody > tr:nth-child(1) > td')).toContainText(['Tristan FIEVET', "tristan@tristan.com"]);
});
