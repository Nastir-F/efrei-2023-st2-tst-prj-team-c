import { test, expect, type Page } from "@playwright/test";

import { createNewTeam, createNewUser } from "../utils";

const NEW_TEAM_NAME = "Test";
const EXISTING_TEAM_NAME = NEW_TEAM_NAME;
const SECOND_TEAM_NAME = "Test 2";
const EMPTY_TEAM_LIST = "---------"

const SQL_INJECTION = `'; DROP TABLE teams; --`;
const DOM_XSS = `</script><script>alert("XSS")</script>`;

const TEAM_ALREADY_EXIST_ERROR = "a team with the same name already exists";
const INTERNAL_SERVER_ERROR = "Server Error (500)";

const USER = {
  name: "John Doe",
  email: "john.doe@email.com",
  address: {
    street: "123 Main Street",
    city: "New York",
    zipCode: "12345",
  },
  hiringDate: "2021-01-01",
  jobTitle: "Software Engineer",
};
const USER_WITH_LONG_ZIP_CODE = {
  ...USER,
  address: {
    ...USER.address,
    zipCode: "757575757575757757575757575757575757577575757575757575757575757757575757575",
  },
};

test.beforeEach(async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/reset_db");
  await page.getByRole("button", { name: "Proceed" }).click();
});

test.describe("Teams", () => {

  test("should allow to create a new team", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, NEW_TEAM_NAME);
    await expect(page.locator("table > tbody > tr > td")).toContainText([NEW_TEAM_NAME]);
  });

  test("should not allow to create a new team with an existing team name", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Create a new team
    await createNewTeam(page, NEW_TEAM_NAME);
    // Try to create a new team with the same name
    await createNewTeam(page, EXISTING_TEAM_NAME);
    // Assert that the error message is visible
    const locator = page.getByText(TEAM_ALREADY_EXIST_ERROR);
    await expect(locator).toBeVisible();
  });

  // TO BE IMPLEMENTED
  test("should not allow to delete a team containing users", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, NEW_TEAM_NAME);
    // Create a new user
    await createNewUser(page, USER);

    // Add the user to the team
    // Try to delete the team

    // Assert that the error message is visible
  });

  // TO BE IMPLEMENTED
  test("should not allow user to be in multiple teams", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, NEW_TEAM_NAME);
    // Create a second team
    await createNewTeam(page, SECOND_TEAM_NAME);
    // Create a new user
    await createNewUser(page, USER);
    // Add the user to the team
    // Add the user to the second team
    // Assert that the error message is visible
  });

  test("should not display a deleted team", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, NEW_TEAM_NAME);
    // Delete the team
    await page.click(`text=${NEW_TEAM_NAME}`);
    await page.click("text=Delete");
    await page.click("text=Proceed");
    // Create a new user
    await createNewUser(page, USER);
    // Try to add the user to the team
    await page.click("text=Edit");
    await page.click("text=Add to team");
    await expect(page.locator("select > option")).toHaveText(EMPTY_TEAM_LIST);
  });
});

test.describe("Users", () => {
  test("should create a new user", async ({ page }: { page: Page }) => {
    // Create a new user
    await createNewUser(page, USER);
    // Check if the user is displayed in the table
    await expect(page.locator("table > tbody > tr > td")).toContainText([USER.name]);
  });

  test("should update user information", async ({ page }: { page: Page }) => {
    // Create a new user
    await createNewUser(page, USER);
    // Update the user information
    await page.click("text=Edit");
    await page.click("text=Update basic info");
    await page.getByPlaceholder('Name').fill('Jean Dupont');
    await page.click("text=Update");
    // Check if the user information is updated
    await expect(page.getByText('Jean Dupont')).toBeVisible();
  });

  test("should not allow to create a new user with a long zip code", async ({ page }: { page: Page }) => {
    // Create a new user
    await createNewUser(page, USER_WITH_LONG_ZIP_CODE);
    // Assert that the error message is visible
    const locator = page.getByText(INTERNAL_SERVER_ERROR);
    await expect(locator).toBeVisible();
  });
});

test.describe("Security", () => {
  test("should not allow SQL injection", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, SQL_INJECTION);

    // Try to create a new team with the same name
    await createNewTeam(page, SQL_INJECTION);

    // Assert that the error message is visible
    const locator = page.getByText(TEAM_ALREADY_EXIST_ERROR);
    await expect(locator).toBeVisible();
  });

  test("should not allow DOM XSS", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, DOM_XSS);

    // Try to create a new team with the same name
    await createNewTeam(page, DOM_XSS);

    // Assert that the error message is visible
    const locator = page.getByText(TEAM_ALREADY_EXIST_ERROR);
    await expect(locator).toBeVisible();
  });
});
