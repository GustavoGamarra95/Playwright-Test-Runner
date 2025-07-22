import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { TestData } from '../data/test-data';

test.describe('Cart Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        await page.goto(TestData.baseUrl);
        await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    });

    test('updates cart badge correctly', async () => {
        await inventoryPage.addToCart(TestData.products.backpack);
        await expect(inventoryPage.cartBadge).toHaveText('1');
        await inventoryPage.addToCart(TestData.products.bikeLight);
        await expect(inventoryPage.cartBadge).toHaveText('2');
    });

    test('removes items from cart', async () => {
        await inventoryPage.addToCart(TestData.products.backpack);
        await inventoryPage.goToCart();
        await cartPage.removeItem(TestData.products.backpack);
        await expect(cartPage.getCartItems()).toHaveCount(0);
    });
});
