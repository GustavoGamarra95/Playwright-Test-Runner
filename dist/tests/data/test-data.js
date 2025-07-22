"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestData = void 0;
exports.TestData = {
    baseUrl: 'https://www.saucedemo.com',
    users: {
        standard: {
            username: 'standard_user',
            password: 'secret_sauce'
        },
        lockedOut: {
            username: 'locked_out_user',
            password: 'secret_sauce'
        }
    },
    products: {
        backpack: 'sauce-labs-backpack',
        bikeLight: 'sauce-labs-bike-light',
        allNames: [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)'
        ]
    }
};
