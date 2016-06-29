
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

// Lifecycle events
book.onStart(() => {
    console.log("Start tracking order book for " + book.getCurrencyPair());

    // Stop tracking after some time
    setTimeout(function() {
        book.stop();
    }, 20000);
});
book.onStop(() => {
    console.log("Order book tracking stopped");
});

// Sync events
book.onSyncBegin(() => {
    console.log("Starting sync between push and public APIs...");
});
book.onSyncComplete(() => {
    console.log("Sync successful! Now tracking " + book.getCurrencyPair() + "...");
});
book.onSyncLost(() => {
    console.log("Lost API synchronization!");
});

// Update events
book.onUpdate(() => {
    console.log("GOT UPDATE");
});

// Start tracking the order book
book.start();
