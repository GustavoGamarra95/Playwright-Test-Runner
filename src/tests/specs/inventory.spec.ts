import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { TestData } from '../data/test-data';

test.describe('Inventory Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto(TestData.baseUrl);
        await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    });

    test('displays all products correctly', async ({ page }) => {
        await expect(page.locator('.inventory_item')).toHaveCount(6);
        await expect(page.locator('.inventory_item_name')).toHaveText(TestData.products.allNames);
    });

    test('sorts products by price', async () => {
        await inventoryPage.sortBy('price_desc');
        const prices = await inventoryPage.getProductPrices();
        expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });
});
