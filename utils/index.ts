import { type Page } from "@playwright/test";
import * as constants from "../utils/constants";

type UserInformation = {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  hiringDate: string;
  jobTitle: string;
};

/**
 * Create a new user
 * @param page
 * @param userInformation
 */
export async function createNewUser(page: Page, userInformation: UserInformation): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/add_employee");
  await page.getByPlaceholder("Name").fill(userInformation.name);
  await page.getByPlaceholder("Email").fill(userInformation.email);
  await page.locator("#id_address_line1").fill(userInformation.address.street);
  await page.getByPlaceholder("City").fill(userInformation.address.city);
  await page.getByPlaceholder("Zip code").fill(userInformation.address.zipCode);
  await page.getByPlaceholder("Hiring date").fill(userInformation.hiringDate);
  await page.getByPlaceholder("Job title").fill(userInformation.jobTitle);
  await page.getByRole("button", { name: "Add" }).press("Enter");
}

/**
 *
 * Create a new team
 * @param page
 * @param teamName
 */
export async function createNewTeam(page: Page, teamName: string): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/add_team");
  await page.getByPlaceholder("Name").fill(teamName);
  await page.getByRole("button", { name: "Add" }).click();
}

/**
 * Delete a team
 * @param page
 * @param teamName
 */
export async function deleteTeam(page: Page, teamName: string): Promise<void> {
  await page
    .getByRole("row", { name: teamName + " View members Delete" })
    .getByRole("link", { name: "Delete" })
    .click();
  await page.click("text=Proceed");
}

/**
 * Add a user to a team
 * @param page
 * @param userId
 */
export async function addUserToTeam(): Promise<void> {
  // TO BE IMPLEMENTED
  // Go to user page list
  // Select the first user
  // Edit the user
  // Add the user to the team
}

/**
 * Update user basic information
 * @param page
 * @param userInformation
 */
export async function updateUser(
  page: Page,
  oldUserInformation: UserInformation,
  updateUserInformation: UserInformation,
  infoToUpdate: string
): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/employees");
  await page
    .getByRole("row", { name: oldUserInformation.name + " " + oldUserInformation.email + " no Edit Delete" })
    .getByRole("link", { name: "Edit" })
    .click();
  // Check which information to update
  if (infoToUpdate === constants.UPDATE_BASIC_INFO) {
    await page.click("text=Update basic info");
    await page.getByPlaceholder("Name").fill(updateUserInformation.name);
    await page.getByPlaceholder("Email").fill(updateUserInformation.email);
    await page.click("text=Update");
  } else if (infoToUpdate === constants.UPDATE_ADDRESS) {
    await page.click("text=Update address");
    await page.locator("#id_address_line1").fill(constants.USER_UPDATE.address.street);
    await page.locator("#id_address_line2").fill("");
    await page.getByPlaceholder("City").fill(constants.USER_UPDATE.address.city);
    await page.getByPlaceholder("Zip code").fill(constants.USER_UPDATE.address.zipCode);
    await page.click("text=Update");
  } else if (infoToUpdate === constants.UPDATE_CONTRACT) {
    await page.click("text=Update contract");
    await page.getByPlaceholder("Job title").fill(constants.USER_UPDATE.jobTitle);
    await page.click("text=Update");
  } else if (infoToUpdate === constants.UPDATE_MANAGER) {
    await page.click("text=Promote as manager");
    await page.click("text=Proceed");
  }
}
