import {Page} from "@playwright/test";

export class LoginPage {
    readonly errorMessage = this.page.locator('[data-test="error"]');

    constructor(public page: Page) {}

    async login(username: string, password: string) {
        await this.page.fill('#user-name', username);
        await this.page.fill('#password', password);
        await this.submitLogin();
    }

    async submitLogin() {
        await this.page.click('#login-button');
    }
}
