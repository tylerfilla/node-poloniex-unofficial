
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

// Get API key and secret from command-line arguments
var apiKey = process.argv[2];
var apiSecret = process.argv[3];

// Get access to the trading API
var poloTrading = polo.api("trading", {
    "apiKey": apiKey,
    "apiSecret": apiSecret
});

// Demonstrate the returnCompleteBalances command
poloTrading.returnCompleteBalances(null, (err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);
    } else {
        // Log response
        console.log(response);
    }
});

// Demonstrate the returnCompleteBalances with all accounts included (lending and margin) command
poloTrading.returnCompleteBalances("all", (err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);
    } else {
        // Log response
        console.log(response);
    }
});
