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
const test_data_1 = require("../data/test-data");
test_1.test.describe('Login Tests', () => {
    let loginPage;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        loginPage = new login_page_1.LoginPage(page);
        yield page.goto(test_data_1.TestData.baseUrl);
    }));
    (0, test_1.test)('fails with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        yield loginPage.login('invalid_user', 'invalid_pass');
        yield (0, test_1.expect)(loginPage.errorMessage).toHaveText('Epic sadface: El nombre de usuario y la contraseña no coinciden con ningún usuario de este servicio');
    }));
    (0, test_1.test)('fails with locked out user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield loginPage.login(test_data_1.TestData.users.lockedOut.username, test_data_1.TestData.users.lockedOut.password);
        yield (0, test_1.expect)(loginPage.errorMessage).toHaveText('Epic sadface: Lo sentimos, este usuario ha sido bloqueado.');
    }));
    (0, test_1.test)('shows error for empty credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        yield loginPage.submitLogin();
        yield (0, test_1.expect)(loginPage.errorMessage).toHaveText('Epic sadface: Se requiere nombre de usuario');
    }));
});
