import { test, expect, type Page } from "@playwright/test";
import { createNewTeam, createNewUser } from "../utils";
import { Guid } from "guid-typescript";

// TODO put data in a separate file
const SQL_INJECTION = `'; DROP TABLE teams; --`;
const DOM_XSS = `</script><script>alert("XSS")</script>`;

const TEAM_ALREADY_EXIST_ERROR = "a team with the same name already exists";
const INTERNAL_SERVER_ERROR = "Server Error (500)";

const USER = {
  name: "",
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

const USER_UPDATE = {
  name: "",
  email: "jean.dupont@email.com",
  address: {
    street: "1 rue de la Paix",
    city: "Paris",
    zipCode: "75001",
  },
  hiringDate: "2023-07-07",
  jobTitle: "CEO",
};

const USER_WITH_HTML_TAG = {
  name: "",
  email: "john.doe@email.com",
  address: {
    street: "<b>123 Main Street</b>",
    city: "<b>New York</b>",
    zipCode: "12345",
  },
  hiringDate: "2021-01-01",
  jobTitle: "<b>Software Engineer</b>",
};

test.afterAll(async ({ page }) => {
  await page.goto("https://c.hr.dmerej.info/reset_db");
  await page.getByRole("button", { name: "Proceed" }).click();
});

test.describe("Teams", () => {
  test("should allow to create a new team", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    await expect(page.locator("table > tbody > tr > td")).toContainText([newTeamName]);
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
    const locator = page.getByText(TEAM_ALREADY_EXIST_ERROR);
    await expect(locator).toBeVisible();
  });

  // TODO
  test("should not allow to delete a team containing users", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Create a new user
    await createNewUser(page, USER);

    // Add the user to the team
    // Try to delete the team

    // Assert that the error message is visible
  });

  // TODO
  test("should not allow user to be in multiple teams", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Create a second team
    const secondTeamName = Guid.create().toString();
    await createNewTeam(page, secondTeamName);
    // Create a new user
    USER.name = Guid.create().toString();
    await createNewUser(page, USER);
    // Add the user to the team
    // Add the user to the second team
    // Assert that the error message is visible
  });

  test("should not display a deleted team", async ({ page }: { page: Page }) => {
    // Create a new team
    const newTeamName = Guid.create().toString();
    await createNewTeam(page, newTeamName);
    // Delete the team
    await page.click(`text=${newTeamName}`);
    await page
      .getByRole("row", { name: newTeamName + " View members Delete" })
      .getByRole("link", { name: "Delete" })
      .click();
    await page.click("text=Proceed");
    // Create a new user
    USER.name = Guid.create().toString();
    await createNewUser(page, USER);
    // Try to add the user to the team
    await page.click("text=Edit");
    await page.click("text=Add to team");

    await expect(page.locator("select > option")).not.toContainText([newTeamName]);
  });
});

test.describe("Users", () => {
  test("should create a new user", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Check if the user is displayed in the table
    await expect(page.locator("table > tbody > tr > td")).toContainText([USER.name]);
  });

  test("should create a new user with html tag", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER_WITH_HTML_TAG;
    newUser.name = "<b>" + Guid.create().toString() + "</b>";
    await createNewUser(page, newUser);
    // Check if the user is displayed in the table
    await expect(page.locator("table > tbody > tr > td")).toContainText([USER_WITH_HTML_TAG.name]);
  });

  test("should update user basic information", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Update the basic information
    await page
      .getByRole("row", { name: newUser.name + " " + newUser.email + " no Edit Delete" })
      .getByRole("link", { name: "Edit" })
      .click();
    await page.click("text=Update basic info");
    const userUpdate = USER_UPDATE;
    userUpdate.name = Guid.create().toString();
    await page.getByPlaceholder("Name").fill(userUpdate.name);
    await page.getByPlaceholder("Email").fill(userUpdate.email);
    await page.click("text=Update");
    // Check if the user basic information is updated
    await expect(page.getByText(userUpdate.name + " - " + userUpdate.email)).toBeVisible();
  });

  // ! The test is failing because address 2 is modified
  test("should update user address", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Update the address
    await page
      .getByRole("row", { name: newUser.name + " " + newUser.email + " no Edit Delete" })
      .getByRole("link", { name: "Edit" })
      .click();
    await page.click("text=Update address");
    await page.locator("#id_address_line1").fill(USER_UPDATE.address.street);
    await page.locator("#id_address_line2").fill("");
    await page.getByPlaceholder("City").fill(USER_UPDATE.address.city);
    await page.getByPlaceholder("Zip code").fill(USER_UPDATE.address.zipCode);
    await page.click("text=Update");
    // Check if the user address is updated
    await page.click("text=Update address");
    await expect(page.locator("#id_address_line1")).toHaveValue(USER_UPDATE.address.street);
    await expect(page.locator("#id_address_line2")).toHaveValue("");
    await expect(page.getByPlaceholder("City")).toHaveValue(USER_UPDATE.address.city);
    await expect(page.getByPlaceholder("Zip code")).toHaveValue(USER_UPDATE.address.zipCode);
  });

  test("should update user contract", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Update the contract
    await page
      .getByRole("row", { name: newUser.name + " " + newUser.email + " no Edit Delete" })
      .getByRole("link", { name: "Edit" })
      .click();
    await page.click("text=Update contract");
    await page.getByPlaceholder("Job title").fill(USER_UPDATE.jobTitle);
    await page.click("text=Update");
    // Check if the user contract is updated
    await expect(page.getByText(USER_UPDATE.jobTitle)).toBeVisible();
  });

  test("should allow to promote a user as a manager", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Promote the user as a manager
    await page
      .getByRole("row", { name: newUser.name + " " + newUser.email + " no Edit Delete" })
      .getByRole("link", { name: "Edit" })
      .click();
    await page.click("text=Promote as manager");
    await page.click("text=Proceed");
    // Check if the user is displayed in the managers table
    await expect(page.locator("table > tbody > tr > td > strong")).toContainText("yes");
  });

  test("should not allow to create a new user with a long zip code", async ({ page }: { page: Page }) => {
    // Create a new user
    const newUser = USER_WITH_LONG_ZIP_CODE;
    newUser.name = Guid.create().toString();
    await createNewUser(page, newUser);
    // Assert that the error message is visible
    await expect(page.getByText(INTERNAL_SERVER_ERROR)).toBeVisible();
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
