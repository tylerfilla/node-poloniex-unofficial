
/*
 *
 * poloniex-unofficial
 * https://git.io/polonode
 *
 * Yet another unofficial Node.js wrapper for the Poloniex cryptocurrency
 * exchange APIs.
 *
 * Copyright (c) 2016 Tyler Filla
 *
 * This software may be modified and distributed under the terms of the MIT
 * license. See the LICENSE file for details.
 *
 */

// Import modules
const polo = require("./../../");

// Localize functions
const CurrencyPair = polo.CurrencyPair;

// Create a new currency pair for the Bitcoin-Ethereum market
const pair1 = new CurrencyPair("BTC", "ETH");

// Get its base currency (should be "BTC")
console.log(pair1.getBase());

// Get its quote currency (should be "ETH")
console.log(pair1.getQuote());

// Get it as a string
console.log(pair1.toString());

// Create another currency pair from string
const pair2 = CurrencyPair.fromString("BTC_ETH");

// Compare them (should be equal)
console.log(pair1.equals(pair2));
