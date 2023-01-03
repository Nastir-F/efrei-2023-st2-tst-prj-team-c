import { test, expect } from "@playwright/test";

// Reset database before each test
test.beforeEach(async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/reset_db");
  await page.getByRole("button", { name: "Proceed" }).click();
});

test.afterAll(async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/reset_db");
  await page.getByRole("button", { name: "Proceed" }).click();
});

test("Should create a user", async ({ page }) => {
  await page.getByRole("link", { name: "Add new employee" }).click();
  await page.getByPlaceholder("Name").fill("Tristan FIEVET");
  await page.getByPlaceholder("Email").fill("tristan@tristan.com");
  await page.locator("#id_address_line1").fill("adresse1");
  await page.locator("#id_address_line2").fill("adresse2");
  await page.getByPlaceholder("City").fill("ville1");
  await page.getByPlaceholder("Zip code").fill("94000");
  await page.getByPlaceholder("Hiring date").fill("2222-12-22");
  await page.getByPlaceholder("Job title").fill("CEO");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("table > tbody > tr > td")).toContainText([
    "Tristan FIEVET",
    "tristan@tristan.com",
  ]);
});

test("Should create a group", async ({ page }) => {
  await page.getByRole("link", { name: "Create new team" }).click();
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill("Dev");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("table > tbody > tr > td")).toContainText(["Dev"]);
});

test("Shouldn't display a deleted teams", async ({ page }) => {
  // Create Dev
  await page.getByRole("link", { name: "Create new team" }).click();
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill("Dev1");
  await page.getByRole("button", { name: "Add" }).click();
  // Delete Dev
  await page.getByRole('row', { name: 'Dev1 View members Delete' }).getByRole('link', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Proceed' }).click();
  // Create a user
  await page.getByRole('link', { name: 'Home' }).click();
  await page.getByRole("link", { name: "Add new employee" }).click();
  await page.getByPlaceholder("Name").fill("Tristan FIEVET");
  await page.getByPlaceholder("Email").fill("tristan@tristan.com");
  await page.locator("#id_address_line1").fill("adresse1");
  await page.locator("#id_address_line2").fill("adresse2");
  await page.getByPlaceholder("City").fill("ville1");
  await page.getByPlaceholder("Zip code").fill("94000");
  await page.getByPlaceholder("Hiring date").fill("2222-12-22");
  await page.getByPlaceholder("Job title").fill("CEO");
  await page.getByRole("button", { name: "Add" }).click();
  // Edit the user
  await page.getByRole('row', { name: 'Tristan FIEVET tristan@tristan.com no Edit Delete' }).getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Add to team' }).click();
  await expect(page.locator("select > option")).toHaveText(["---------"]);
});