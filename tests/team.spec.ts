import { test, expect, type Page } from "@playwright/test";
import { createNewTeam, createNewUser, deleteTeam, addUserToTeam } from "../utils/index";
import * as constants from "../utils/constants";
import { Guid } from "guid-typescript";

test.describe("Teams creation", () => {
  test("should allow to create a new team", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Check that the team is visible in the table
    await expect(page.getByRole("row", { name: `${newTeamName} View members Delete` })).toBeVisible();
  });

  test("should not allow to create a new team with an existing team name", async ({
    page,
  }: {
    page: Page;
  }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Try to create a new team with the same name
    await createNewTeam(page, newTeamName);
    // Assert that the error message is visible
    await expect(page.getByText(constants.TEAM_ALREADY_EXIST_ERROR)).toBeVisible();
  });

  // ! There is an error 500 when we try to create a team with an empty name
  test("should not be able to create a team with spaces in name", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = "  ";
    await createNewTeam(page, newTeamName);
    // Check if there is an error message
    await expect(page.getByText(constants.REQUIRED_FIELD_ERROR)).toBeVisible();
  });
});

test.describe("Teams creation", () => {
  // ! When you delete a team with users, the users are also deleted
  test("should not allow to delete a team containing users", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Add the user to the team
    await addUserToTeam(page, newUser, newTeamName);
    // Try to delete the team
    await deleteTeam(page, newTeamName);
    // Assert that the error message is visible
    await expect(page.getByRole("row", { name: `${newTeamName} View members Delete` })).toBeVisible();
  });

  test("should allow to delete an empty team", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Delete the team
    await deleteTeam(page, newTeamName);
    // Check if the team is deleted
    await expect(page.getByRole("row", { name: `${newTeamName} View members Delete` })).not.toBeVisible();
  });

  test("should not display a deleted team", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Delete the team
    await deleteTeam(page, newTeamName);
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, constants.USER);
    // Try to add the user to the team
    await page
      .getByRole("row", { name: `${newUser.name} ${newUser.email} no Edit Delete` })
      .getByRole("link", { name: "Edit" })
      .click();
    await page.getByRole("link", { name: "Add to team" }).click();
    // Check if the team is not displayed in the select
    await expect(page.locator("select > option")).not.toContainText([newTeamName]);
  });
});
