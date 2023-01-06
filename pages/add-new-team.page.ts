import { Page } from '@playwright/test';
import * as constants from '../utils/constants';

export class AddNewTeamPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(`${constants.BASE_URL}/add_team`);
  }

  async fillName(name: string) {
    await this.page.locator("#id_name").fill(name);
  }

  async clickAdd() {
    await this.page.getByRole("button", { name: "Add" }).press("Enter");
  }
}
