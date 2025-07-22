import {Page} from "@playwright/test";

export class InventoryPage {
    readonly cartBadge = this.page.locator('.shopping_cart_badge');

    constructor(public page: Page) {}

    async addToCart(itemName: string) {
        await this.page.click(`[data-test="add-to-cart-${itemName}"]`);
    }

    async goToCart() {
        await this.page.click('.shopping_cart_link');
    }

    async sortBy(value: string) {
        await this.page.selectOption('.product_sort_container', value);
    }

    async getProductPrices(): Promise<number[]> {
        const prices = await this.page.$$eval('.inventory_item_price',
            els => els.map(el => parseFloat(el.textContent!.replace('$', '')))
        );
        return prices;
    }
}
