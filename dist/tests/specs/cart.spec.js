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
const cart_page_1 = require("../pages/cart.page");
const test_data_1 = require("../data/test-data");
test_1.test.describe('Cart Tests', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        loginPage = new login_page_1.LoginPage(page);
        inventoryPage = new inventory_page_1.InventoryPage(page);
        cartPage = new cart_page_1.CartPage(page);
        yield page.goto(test_data_1.TestData.baseUrl);
        yield loginPage.login(test_data_1.TestData.users.standard.username, test_data_1.TestData.users.standard.password);
    }));
    (0, test_1.test)('updates cart badge correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        yield inventoryPage.addToCart(test_data_1.TestData.products.backpack);
        yield (0, test_1.expect)(inventoryPage.cartBadge).toHaveText('1');
        yield inventoryPage.addToCart(test_data_1.TestData.products.bikeLight);
        yield (0, test_1.expect)(inventoryPage.cartBadge).toHaveText('2');
    }));
    (0, test_1.test)('removes items from cart', () => __awaiter(void 0, void 0, void 0, function* () {
        yield inventoryPage.addToCart(test_data_1.TestData.products.backpack);
        yield inventoryPage.goToCart();
        yield cartPage.removeItem(test_data_1.TestData.products.backpack);
        yield (0, test_1.expect)(cartPage.getCartItems()).toHaveCount(0);
    }));
});
