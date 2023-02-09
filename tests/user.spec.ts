import { test, expect, type Page } from "@playwright/test";
import { createNewTeam, createNewUser, updateUser, addUserToTeam, deleteUser } from "../utils/index";
import * as constants from "../utils/constants";
import { Guid } from "guid-typescript";

test.describe("Users creation", () => {
  test("should create a new user", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Assert that the user is visible in the table
    await expect(
      page.getByRole("row", { name: `${newUser.name} ${newUser.email} no Edit Delete` })
    ).toBeVisible();
  });

  // ! It's possible to create 2 users with the same email
  test("should not be able to create a user with an existing email", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Try to create a new user with the same email
    await createNewUser(page, newUser);
    // Assert that the error message is visible
    await expect(page.getByText(constants.EMAIL_ALREADY_EXIST_ERROR)).toBeVisible();
  });

  test("should not be able to create a user with spaces in name...", async ({ page }: { page: Page }) => {
    // Create a new user
    await createNewUser(page, constants.USER_WITH_SPACE_IN_FIELD);
    // Assert that the error message is visible
    await expect(page.getByText(constants.REQUIRED_FIELD_ERROR)).toHaveCount(4);
  });

  test("should create a new user with html tag", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER_WITH_HTML_TAG;
    newUser.name = "<b>" + Guid.create().toString() + "</b>";
    await createNewUser(page, newUser);
    // Assert that the user is visible in the table
    await expect(
      page.getByRole("row", { name: `${newUser.name} ${newUser.email} no Edit Delete` })
    ).toBeVisible();
  });

  // ! The is failing because we have an servor error (500)
  test("should not allow to create a new user with a long zip code", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER_WITH_LONG_ZIP_CODE;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Assert that the error message is visible
    await expect(page.getByText(constants.ZIP_CODE_TOO_LONG_ERROR)).toBeVisible();
  });
});

test.describe("Users update", () => {
  test("should update user basic information", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Update the basic information
    const userUpdate = constants.USER_UPDATE;
    userUpdate.name = Guid.create().toString();
    await updateUser(page, newUser, userUpdate, constants.UPDATE_BASIC_INFO);
    // Assert that the user basic information is updated
    await expect(page.getByText(`${userUpdate.name} - ${userUpdate.email}`)).toBeVisible();
  });

  // ! The test is failing because address 2 is modified
  test("should update user address", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Update the address
    await updateUser(page, newUser, constants.USER_UPDATE, constants.UPDATE_ADDRESS);
    // Assert that the user address is updated
    await page.getByRole("link", { name: "Update address" }).click();
    await expect(page.locator("#id_address_line1")).toHaveValue(constants.USER_UPDATE.address_line1);
    await expect(page.locator("#id_address_line2")).toHaveValue(constants.USER_UPDATE.address_line2);
    await expect(page.getByPlaceholder("City")).toHaveValue(constants.USER_UPDATE.city);
    await expect(page.getByPlaceholder("Zip code")).toHaveValue(constants.USER_UPDATE.zipCode);
  });

  test("should update user contract", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Update the contract
    await updateUser(page, newUser, constants.USER_UPDATE, constants.UPDATE_CONTRACT);
    // Assert that the user contract is updated
    await expect(page.getByText(constants.USER_UPDATE.jobTitle)).toBeVisible();
  });

  test("should allow to promote a user as a manager", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Promote the user as a manager
    await updateUser(page, newUser, constants.USER_UPDATE, constants.UPDATE_MANAGER);
    // Assert that the user is a manager
    await expect(
      page
        .getByRole("row", { name: `${newUser.name} ${newUser.email} yes Edit Delete` })
        .getByRole("cell", { name: "yes" })
    ).toBeVisible();
  });

  test("should add a user to a team", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Add the user to the team
    await addUserToTeam(page, newUser, newTeamName);
    // Assert that the user is in the team
    await page.goto(`${constants.BASE_URL}/teams`);
    await page
      .getByRole("row", { name: `${newTeamName} View members Delete` })
      .getByRole("link", { name: "View members" })
      .click();
    await expect(page.getByText(newUser.name)).toBeVisible();
  });

  test("should not allow user to be in multiple teams", async ({ page }: { page: Page }) => {
    // Create a new team
    const firstTeamName = Guid.create().toString();
    await createNewTeam(page, firstTeamName);
    // Create a second team
    const secondTeamName = Guid.create().toString();
    await createNewTeam(page, secondTeamName);
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Add the user to the team
    await addUserToTeam(page, newUser, firstTeamName);
    // Add the user to the second team
    await addUserToTeam(page, newUser, secondTeamName);
    // Assert that the user isn't in the first team
    await page.goto(`${constants.BASE_URL}/teams`);
    await page
      .getByRole("row", { name: `${firstTeamName} View members Delete` })
      .getByRole("link", { name: "View members" })
      .click();
    await expect(page.getByText(newUser.name)).not.toBeVisible();
    // Assert that the user is in the second team
    await page.goto(`${constants.BASE_URL}/teams`);
    await page
      .getByRole("row", { name: `${secondTeamName} View members Delete` })
      .getByRole("link", { name: "View members" })
      .click();
    await expect(page.getByText(newUser.name)).toBeVisible();
  });
});

test.describe("Users delete", () => {
  test("should be able to delete a user", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Delete the user
    await deleteUser(page, newUser);
    // Assert that the user is deleted
    await expect(
      page.getByRole("row", { name: `${newUser.name} ${newUser.email} no Edit Delete` })
    ).not.toBeVisible();
  });

  test("should display user information when we want to delete it", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = constants.USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Try to delete the user
    await page
      .getByRole("row", { name: `${newUser.name} ${newUser.email} no Edit Delete` })
      .getByRole("link", { name: "Delete" })
      .click();
    // Assert that the user information is displayed
    await expect(page.getByText(`name: ${newUser.name}`)).toBeVisible();
    await expect(page.getByText(`email: ${newUser.email}`)).toBeVisible();
  });
});
