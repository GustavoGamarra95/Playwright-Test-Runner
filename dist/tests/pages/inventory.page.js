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
exports.InventoryPage = void 0;
class InventoryPage {
    constructor(page) {
        this.page = page;
        this.cartBadge = this.page.locator('.shopping_cart_badge');
    }
    addToCart(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.click(`[data-test="add-to-cart-${itemName}"]`);
        });
    }
    goToCart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.click('.shopping_cart_link');
        });
    }
    sortBy(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.selectOption('.product_sort_container', value);
        });
    }
    getProductPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            const prices = yield this.page.$$eval('.inventory_item_price', els => els.map(el => parseFloat(el.textContent.replace('$', ''))));
            return prices;
        });
    }
}
exports.InventoryPage = InventoryPage;
