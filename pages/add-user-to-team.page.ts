import { Page } from '@playwright/test';

export class AddUserToTeamPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.getByRole("link", { name: "Add to team" }).click();
  }

  async fillTeamSelect(teamName: string) {
    await this.page.locator("#id_team").selectOption({ label: teamName + " team" });
  }

  async clickAdd() {
    await this.page.getByRole("button", { name: "Add" }).press("Enter");
  }
}
