
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

// Create a new currency pair for the Bitcoin-Ethereum market
const pair = new polo.CurrencyPair("BTC", "ETH");

// Get its base currency (should be "BTC")
console.log(pair.getBase());

// Get its quote currency (should be "ETH")
console.log(pair.getQuote());

// Get its Poloniex pair string (should be "BTC_ETH")
console.log(pair.getPairString());
