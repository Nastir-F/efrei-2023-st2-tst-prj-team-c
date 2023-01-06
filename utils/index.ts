import { type Page } from "@playwright/test";
import * as constants from "../utils/constants";
import { AddNewUserPage } from "../pages/add-new-user.page";
import { AddNewTeamPage } from "../pages/add-new-team.page";
import { UpdateUserPage } from "../pages/update-user-page";
import { AddUserToTeamPage } from "../pages/add-user-to-team.page";

type UserInformation = {
  name: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  zipCode: string;
  hiringDate: string;
  jobTitle: string;
};

/**
 * Create a new user
 * @param page
 * @param userInformation
 */
export async function createNewUser(page: Page, userInformation: UserInformation): Promise<void> {
  const addNewUserPage = new AddNewUserPage(page);
  await addNewUserPage.goto();
  await addNewUserPage.fillForm(
    userInformation.name,
    userInformation.email,
    userInformation.address_line1,
    userInformation.address_line2,
    userInformation.city,
    userInformation.zipCode,
    userInformation.hiringDate,
    userInformation.jobTitle
  );
  await addNewUserPage.clickAdd();
}

/**
 * Delete a user
 * @param page
 * @param userInformation
 */
export async function deleteUser(page: Page, userInformation: UserInformation): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/employees");
  await page
    .getByRole("row", { name: `${userInformation.name} ${userInformation.email} no Edit Delete` })
    .getByRole("link", { name: "Delete" })
    .click();
  await page.getByRole("button", { name: "Proceed" }).click();
}

/**
 *
 * Create a new team
 * @param page
 * @param teamName
 */
export async function createNewTeam(page: Page, teamName: string): Promise<void> {
  const addNewTeamPage = new AddNewTeamPage(page);
  await addNewTeamPage.goto();
  await addNewTeamPage.fillName(teamName);
  await addNewTeamPage.clickAdd();
}

/**
 * Delete a team
 * @param page
 * @param teamName
 */
export async function deleteTeam(page: Page, teamName: string): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/teams");
  await page
    .getByRole("row", { name: `${teamName} View members Delete` })
    .getByRole("link", { name: "Delete" })
    .click();
  await page.getByRole("button", { name: "Proceed" }).click();
}

/**
 * Add a user to a team
 * @param page
 * @param userId
 */
export async function addUserToTeam(
  page: Page,
  userInformation: UserInformation,
  teamName: string
): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/employees");
  await page
    .getByRole("row", { name: `${userInformation.name} ${userInformation.email} no Edit Delete` })
    .getByRole("link", { name: "Edit" })
    .click();
  const addUserToTeamPage = new AddUserToTeamPage(page);
  await addUserToTeamPage.goto();
  await addUserToTeamPage.fillTeamSelect(teamName);
  await addUserToTeamPage.clickAdd();
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
  updateType: string
): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/employees");
  await page
    .getByRole("row", { name: `${oldUserInformation.name} ${oldUserInformation.email} no Edit Delete` })
    .getByRole("link", { name: "Edit" })
    .click();
  // Check which information to update
  const updateUserPage = new UpdateUserPage(page, updateType);
  await updateUserPage.gotoUpdateType();
  await updateUserPage.fillForm(
    updateUserInformation.name,
    updateUserInformation.email,
    updateUserInformation.address_line1,
    updateUserInformation.address_line2,
    updateUserInformation.city,
    updateUserInformation.zipCode,
    updateUserInformation.jobTitle
  );
  if (
    updateType === constants.UPDATE_BASIC_INFO ||
    updateType === constants.UPDATE_CONTRACT ||
    updateType === constants.UPDATE_ADDRESS
  ) {
    await updateUserPage.clickUpdate();
  }
}
