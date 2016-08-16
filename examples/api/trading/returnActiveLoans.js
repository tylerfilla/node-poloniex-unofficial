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

"use strict";

// Import main module
const polo = require("./../../../");

// Obtain API credentials from environment
const apiKey = process.env.POLONIEX_API_TEST_NOP_KEY;
const apiSecret = process.env.POLONIEX_API_TEST_NOP_SECRET;

// Create authenticated trading API wrapper
const poloTrading = new polo.TradingWrapper(apiKey, apiSecret, () => 55);

// Demonstrate the returnActiveLoans command (callback-style)
poloTrading.returnActiveLoans((err, response) => {
    if (err) {
        throw err.msg;
    }

    console.log("Using callback:");
    console.log(response);
});

// Demonstrate the returnActiveLoans command (promise-style)
poloTrading.returnActiveLoans().then(res => {
    console.log("Using promise:");
    console.log(res);
}).catch(err => {
    console.error(err);
});
