"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const login_page_1 = require("../pages/login.page");
const inventory_page_1 = require("../pages/inventory.page");
const test_data_1 = require("../data/test-data");
test_1.test.describe('Sauce Demo Tests', () => {
    let loginPage;
    let inventoryPage;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        loginPage = new login_page_1.LoginPage(page);
        inventoryPage = new inventory_page_1.InventoryPage(page);
        yield page.goto(test_data_1.TestData.baseUrl);
    }));
    (0, test_1.test)('complete purchase flow', (_a, testInfo_1) => __awaiter(void 0, [_a, testInfo_1], void 0, function* ({ page }, testInfo) {
        yield loginPage.login(test_data_1.TestData.users.standard.username, test_data_1.TestData.users.standard.password);
        yield page.screenshot({ path: `test-results/${testInfo.title}/after-login.png` });
        yield inventoryPage.addToCart(test_data_1.TestData.products.backpack);
        yield inventoryPage.addToCart(test_data_1.TestData.products.bikeLight);
        yield page.screenshot({ path: `test-results/${testInfo.title}/items-added.png` });
        yield inventoryPage.goToCart();
        yield page.screenshot({ path: `test-results/${testInfo.title}/cart.png` });
        yield page.click('[data-test="checkout"]');
        yield page.fill('[data-test="firstName"]', 'Test');
        yield page.fill('[data-test="lastName"]', 'User');
        yield page.fill('[data-test="postalCode"]', '12345');
        yield page.screenshot({ path: `test-results/${testInfo.title}/checkout-info.png` });
        yield page.click('[data-test="continue"]');
        yield page.click('[data-test="finish"]');
        yield (0, test_1.expect)(page.locator('.complete-header')).toHaveText('Thank you for your order!');
        yield page.screenshot({ path: `test-results/${testInfo.title}/order-complete.png` });
    }));
});
