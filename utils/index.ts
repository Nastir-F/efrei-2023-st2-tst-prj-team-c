import { type Page } from "@playwright/test";

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
export async function createNewUser(
  page: Page,
  userInformation: UserInformation
): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/add_employee");
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill(userInformation.name);
  await page.getByPlaceholder("Name").press("Tab");
  await page.getByPlaceholder("Email").fill(userInformation.email);
  await page.getByPlaceholder("Email").press("Tab");
  await page.locator("#id_address_line1").fill(userInformation.address.street);
  await page.locator("#id_address_line1").press("Tab");
  await page.locator("#id_address_line2").press("Tab");
  await page.getByPlaceholder("City").fill(userInformation.address.city);
  await page.getByPlaceholder("City").press("Tab");
  await page.getByPlaceholder("Zip code").fill(userInformation.address.zipCode);
  await page.getByPlaceholder("Zip code").press("Tab");
  await page.getByPlaceholder("Hiring date").fill(userInformation.hiringDate);
  await page.getByPlaceholder("Hiring date").press("Tab");
  await page.getByPlaceholder("Job title").fill(userInformation.jobTitle);
  await page.getByPlaceholder("Job title").press("Tab");
  await page.getByRole("button", { name: "Add" }).press("Enter");
}

/**
 *
 * Create a new team
 * @param page
 * @param teamName
 */
export async function createNewTeam(
  page: Page,
  teamName: string
): Promise<void> {
  await page.goto("https://c.hr.dmerej.info/add_team");
  await page.getByPlaceholder("Name").click();
  await page.getByPlaceholder("Name").fill(teamName);
  await page.getByRole("button", { name: "Add" }).click();
}

/**
 * Delete a team
 * @param page
 * @param teamName
 */
export async function deleteTeam(): Promise<void> {
  // TO BE IMPLEMENTED
  // Go to team page list
  // Select the first team
  // Edit the team
  // Delete the team
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
