import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { TestData } from '../data/test-data';

test.describe('Sauce Demo Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto(TestData.baseUrl);
    });

    test('complete purchase flow', async ({ page }, testInfo) => {
        await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
        await page.screenshot({ path: `test-results/${testInfo.title}/after-login.png` });

        await inventoryPage.addToCart(TestData.products.backpack);
        await inventoryPage.addToCart(TestData.products.bikeLight);
        await page.screenshot({ path: `test-results/${testInfo.title}/items-added.png` });

        await inventoryPage.goToCart();
        await page.screenshot({ path: `test-results/${testInfo.title}/cart.png` });

        await page.click('[data-test="checkout"]');
        await page.fill('[data-test="firstName"]', 'Test');
        await page.fill('[data-test="lastName"]', 'User');
        await page.fill('[data-test="postalCode"]', '12345');
        await page.screenshot({ path: `test-results/${testInfo.title}/checkout-info.png` });

        await page.click('[data-test="continue"]');
        await page.click('[data-test="finish"]');

        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
        await page.screenshot({ path: `test-results/${testInfo.title}/order-complete.png` });
    });
});
