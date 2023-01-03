import { test, expect, type Page } from "@playwright/test";

import { createNewTeam, createNewUser } from "../utils";

const NEW_TEAM_NAME = "Test";
const EXISTING_TEAM_NAME = NEW_TEAM_NAME;

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
    zipCode:
      "757575757575757757575757575757575757577575757575757575757575757757575757575",
  },
};

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

// TO BE IMPLEMENTED
test("should not allow to delete a team containing players", async ({
  page,
}: {
  page: Page;
}) => {
  // Create a new team
  await createNewTeam(page, NEW_TEAM_NAME);
  // Create a new user
  await createNewUser(page, USER);

  // Add the user to the team
  // Try to delete the team

  // Assert that the error message is visible
});

test("should not allow to create a new user with a long zip code", async ({
  page,
}: {
  page: Page;
}) => {
  // Create a new user
  await createNewUser(page, USER_WITH_LONG_ZIP_CODE);
  // Assert that the error message is visible
  const locator = page.getByText(INTERNAL_SERVER_ERROR);
  await expect(locator).toBeVisible();
});
