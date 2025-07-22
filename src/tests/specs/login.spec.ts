import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TestData } from '../data/test-data';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(TestData.baseUrl);
    });

    test('fails with invalid credentials', async () => {
        await loginPage.login('invalid_user', 'invalid_pass');
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: El nombre de usuario y la contraseña no coinciden con ningún usuario de este servicio');
    });

    test('fails with locked out user', async () => {
        await loginPage.login(TestData.users.lockedOut.username, TestData.users.lockedOut.password);
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Lo sentimos, este usuario ha sido bloqueado.');
    });

    test('shows error for empty credentials', async () => {
        await loginPage.submitLogin();
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Se requiere nombre de usuario');
    });
});
