import { test, expect, type Page } from "@playwright/test";
import { createNewTeam } from "../utils/index";
import * as constants from "../utils/constants";

test.describe("Security", () => {
  test("should not allow SQL injection", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, constants.SQL_INJECTION);
    // Try to create a new team with the same name
    await createNewTeam(page, constants.SQL_INJECTION);
    // Assert that the error message is visible
    const locator = page.getByText(constants.TEAM_ALREADY_EXIST_ERROR);
    await expect(locator).toBeVisible();
  });

  test("should not allow DOM XSS", async ({ page }: { page: Page }) => {
    // Create a new team
    await createNewTeam(page, constants.DOM_XSS);
    // Try to create a new team with the same name
    await createNewTeam(page, constants.DOM_XSS);
    // Assert that the error message is visible
    const locator = page.getByText(constants.TEAM_ALREADY_EXIST_ERROR);
    await expect(locator).toBeVisible();
  });
});
