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
test_1.test.describe('Inventory Tests', () => {
    let loginPage;
    let inventoryPage;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        loginPage = new login_page_1.LoginPage(page);
        inventoryPage = new inventory_page_1.InventoryPage(page);
        yield page.goto(test_data_1.TestData.baseUrl);
        yield loginPage.login(test_data_1.TestData.users.standard.username, test_data_1.TestData.users.standard.password);
    }));
    (0, test_1.test)('displays all products correctly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield (0, test_1.expect)(page.locator('.inventory_item')).toHaveCount(6);
        yield (0, test_1.expect)(page.locator('.inventory_item_name')).toHaveText(test_data_1.TestData.products.allNames);
    }));
    (0, test_1.test)('sorts products by price', () => __awaiter(void 0, void 0, void 0, function* () {
        yield inventoryPage.sortBy('price_desc');
        const prices = yield inventoryPage.getProductPrices();
        (0, test_1.expect)(prices).toEqual([...prices].sort((a, b) => b - a));
    }));
});
