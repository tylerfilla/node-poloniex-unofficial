
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
const polo = require("./../../../");

// Get access to the public API
const poloPublic = new polo.PublicWrapper();

// Command parameters
var params = {
    currencyPair: "BTC_ETH",
    start: Math.floor(Date.now() / 1000) - 10 * 14400,
    end: Math.floor(Date.now() / 1000),
    period: 14400
};

// Demonstrate the returnChartData command
poloPublic.returnChartData(params, (err, response) => {
    if (err) {
        throw err.msg;
    }

    console.log(response);
});
