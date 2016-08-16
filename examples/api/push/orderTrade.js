
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

// Import main module
const polo = require("./../../../");

// Import local modules
const CurrencyPair = require("./../../../lib/util/CurrencyPair.js");

// Get access to the push API
const poloPush = new polo.PushWrapper();

// Feed parameters
var params = {
    currencyPair: new CurrencyPair("BTC", "ETH")
};

// Receive order book and trade updates for BTC_ETH
poloPush.orderTrade(params, (err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Disconnect
        return true;
    }

    // Log raw response
    console.log(response);
});
