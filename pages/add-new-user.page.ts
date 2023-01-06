import { Page } from '@playwright/test';
import * as constants from '../utils/constants';

export class AddNewUserPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`${constants.BASE_URL}/add_employee`);
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

  async fillHiringDate(hiringDate: string) {
    await this.page.locator("#id_hiring_date").fill(hiringDate);
  }

  async fillJobTitle(jobTitle: string) {
    await this.page.locator("#id_job_title").fill(jobTitle);
  }

  async fillForm(name: string, email: string, address_line1: string, address_line2: string, city: string, zipCode: string, hiringDate: string, jobTitle: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillAddress1(address_line1);
    await this.fillAddress2(address_line2);
    await this.fillCity(city);
    await this.fillZipCode(zipCode);
    await this.fillHiringDate(hiringDate);
    await this.fillJobTitle(jobTitle);
  }

  async clickAdd() {
    await this.page.getByRole("button", { name: "Add" }).press("Enter");
  }
}
