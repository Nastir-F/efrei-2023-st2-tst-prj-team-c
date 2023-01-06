import { Page } from '@playwright/test';

export class AddNewTeamPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('https://c.hr.dmerej.info/add_team');
  }

  async fillName(name: string) {
    await this.page.locator("#id_name").fill(name);
  }

  async clickAdd() {
    await this.page.getByRole("button", { name: "Add" }).press("Enter");
  }
}
