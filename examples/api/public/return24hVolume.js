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

// Create public API wrapper
const poloPublic = new polo.PublicWrapper();

// Demonstrate the return24hVolume command (callback-style)
poloPublic.return24hVolume((err, response) => {
    if (err) {
        throw err.msg;
    }

    console.log("Using callback:");
    console.log(response);
});

// Demonstrate the return24hVolume command (promise-style)
poloPublic.return24hVolume().then(res => {
    console.log("Using promise:");
    console.log(res);
}).catch(err => {
    throw err.msg;
});
