import { Page } from '@playwright/test';
import { UPDATE_BASIC_INFO, UPDATE_ADDRESS, UPDATE_CONTRACT, UPDATE_MANAGER } from '../utils/constants';

export class UpdateUserPage {
  private page: Page;
  private updateType: string;

  constructor(page: Page, updateType: string) {
    this.page = page;
    this.updateType = updateType;
  }

  async gotoUpdateType() {
    await this.page.getByRole("link", { name: this.updateType }).click();
  }

  async fillName(name: string) {
    await this.page.locator("#id_name").fill(name);
  }

  async fillEmail(email: string) {
    await this.page.locator("#id_email").fill(email);
  }

  async fillAddress1(address: string) {
    await this.page.locator("#id_address_line1").fill(address);
  }

  async fillAddress2(address: string) {
    await this.page.locator("#id_address_line2").fill(address);
  }

  async fillCity(city: string) {
    await this.page.locator("#id_city").fill(city);
  }

  async fillZipCode(zipCode: string) {
    await this.page.locator("#id_zip_code").fill(zipCode);
  }

  async fillJobTitle(jobTitle: string) {
    await this.page.locator("#id_job_title").fill(jobTitle);
  }

  async promoteManager() {
    await this.page.getByRole("button", { name: "Proceed" }).click();
  }

  async fillForm(name: string, email: string, address: string, city: string, zipCode: string, jobTitle: string) {
    if (this.updateType === UPDATE_BASIC_INFO) {
      await this.fillName(name);
      await this.fillEmail(email);
    } else if (this.updateType === UPDATE_ADDRESS) {
      await this.fillAddress1(address);
      await this.fillCity(city);
      await this.fillZipCode(zipCode);
    } else if (this.updateType === UPDATE_CONTRACT) {
      await this.fillJobTitle(jobTitle);
    } else if (this.updateType === UPDATE_MANAGER) {
      await this.promoteManager();
    }
  }

  async clickUpdate() {
    await this.page.getByRole("button", { name: "Update" }).press("Enter");
  }
}
