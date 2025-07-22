import {Page} from "@playwright/test";

export class CartPage {
    constructor(public page: Page) {}

    async removeItem(itemName: string) {
        await this.page.click(`[data-test="remove-${itemName}"]`);
    }

    getCartItems() {
        return this.page.locator('.cart_item');
    }
}
