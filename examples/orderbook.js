
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
var polo = require("./../");

// Create a new order book tracker for the Bitcoin-Ethereum market
var book = new polo.OrderBook("BTC_ETH");

// Create and use default wrappers
book.useDefaultWrappers();

// Lifecycle events
book.onStart(() => {
    console.log("Started tracking market");
});
book.onStop(() => {
    console.log("Tracking stopped");
});
book.onSync(() => {
    console.log("Synchronized push API with public API");
});
book.onLoseSync(() => {
    console.log("Lost API synchronization");
});

// Start tracking the market
book.start();

// Stop tracking after 10 seconds
setTimeout(function() {
    book.stop();
}, 10000);
