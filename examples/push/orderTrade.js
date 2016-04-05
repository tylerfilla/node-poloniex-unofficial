
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
var polo = require("./../../");

// Get access to the push API
var poloPush = polo.api("push");

// Receive order book and trade updates for BTC_ETH
poloPush.orderTrade("BTC_ETH", (err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);
    } else {
        // Log response
        console.log(response);

        switch (response.type) {
        case "orderBookModify":
            // An order book entry has appeared/changed
            break;
        case "orderBookRemove":
            // An order book entry has been entirely removed
            break;
        case "newTrade":
            // A new trade(s) has been posted
            break;
        }
    }
});
