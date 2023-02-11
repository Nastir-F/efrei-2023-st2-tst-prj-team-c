import { test, expect, chromium } from "@playwright/test";

// Reset database before each test
test.beforeEach(async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/reset_db");
  await page.getByRole("button", { name: "Proceed" }).click();
});

test("Should create a user", async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/");
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
  await expect(page.locator("table > tbody > tr:nth-child(1) > td")).toContainText([
    "Tristan FIEVET",
    "tristan@tristan.com",
  ]);
});

test("Should create a group", async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/");
  await page.getByRole("link", { name: "Create new team" }).click();
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill("Dev");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.locator("table > tbody > tr:nth-child(1) > td")).toContainText(["Dev"]);
});


test('Create an employee and updating his infos', async ({ page }) => {

  await page.goto('https://c.hr.dmerej.info/add_employee');

  await page.goto('https://c.hr.dmerej.info/');
  await page.getByRole('link', { name: 'Add new employee' }).click();
  await page.getByPlaceholder('Name').fill('Jean Dupont');
  await page.getByPlaceholder('Email').fill('jean.dupont@gmail.com');
  await page.locator('#id_address_line1').fill('6 rue de la pompe');
  await page.getByPlaceholder('City').fill('Paris');
  await page.getByPlaceholder('Zip code').fill('75012');
  await page.getByPlaceholder('Hiring date').fill('2023-01-01');
  await page.getByPlaceholder('Job title').fill('Boss');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('row', { name: 'Jean Dupont jean.dupont@gmail.com no Edit Delete' }).getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Update basic info' }).click();
  await page.getByPlaceholder('Name').fill('Jean Dupond');
  await page.getByPlaceholder('Email').fill('jean.dupond@gmail.com');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.goto('https://c.hr.dmerej.info/employees');

  await expect(page.locator("table > tbody > tr:nth-child(1) > td")).toContainText([
    "Jean Dupond",
    "jean.dupond@gmail.com",
  ]);

});

test('Avoid the user to update employee infos with empty fillings', async ({ page }) => {

  const browser = await chromium.launch({ headless: false, slowMo: 50 });

  const context = await browser.newContext();

  await context.close();
  await browser.close();

  await page.goto('https://c.hr.dmerej.info/add_employee');

  await page.goto('https://c.hr.dmerej.info/');
  await page.getByRole('link', { name: 'Add new employee' }).click();
  await page.getByPlaceholder('Name').fill('Jean Dupont');
  await page.getByPlaceholder('Email').fill('jean.dupont@gmail.com');
  await page.locator('#id_address_line1').fill('6 rue de la pompe');
  await page.getByPlaceholder('City').fill('Paris');
  await page.getByPlaceholder('Zip code').fill('75012');
  await page.getByPlaceholder('Hiring date').fill('2023-01-01');
  await page.getByPlaceholder('Job title').fill('Boss');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('row', { name: 'Jean Dupont jean.dupont@gmail.com no Edit Delete' }).getByRole('link', { name: 'Edit' }).click();
  await page.getByRole('link', { name: 'Update basic info' }).click();

  await page.getByPlaceholder('Name').fill('');
  await page.getByRole('button', { name: 'Update' }).click();

  await expect(page.locator('h2')).toContainText("Edit Employee Basic Information")

  await page.getByPlaceholder('Email').fill('');
  await page.getByRole('button', { name: 'Update' }).click();

  await expect(page.locator('h2')).not.toContainText("Edit Employee")

});