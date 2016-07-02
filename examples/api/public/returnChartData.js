
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

// Get access to the public API
var poloPublic = new polo.PublicWrapper();

// Demonstrate the returnChartData command
poloPublic.returnChartData("BTC_ETH", Math.floor(Date.now() / 1000) - 10*14400, Math.floor(Date.now() / 1000), 14400, (err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);
    } else {
        // Log response
        console.log(response);
    }
});
