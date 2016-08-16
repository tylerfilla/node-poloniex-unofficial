#!/usr/bin/env node
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

// Create public API wrapper
const poloPublic = new polo.PublicWrapper();

// Command parameters
var params = {
    currencyPair: new polo.CurrencyPair("BTC", "ETH"),
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
