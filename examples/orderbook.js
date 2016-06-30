
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

// Stats
var syncsLost = 0;
var updates = 0;

// Lifecycle events
book.onStart(() => {
    console.log("Start tracking order book for " + book.getCurrencyPair());

    // Stop tracking after some time
    setTimeout(function() {
        //book.stop();
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
    syncsLost++;
    console.log("Lost API synchronization!");
});

// Update events
book.onUpdate(() => {
    updates++;

    console.log("--------------------------------------------------------------------------------");
    console.log("Updates rx'd: " + updates + " / Buffered: " + book._updateBuffer.length + " / Syncs lost: " + syncsLost);
    console.log("Sell\t\t\t\t\t\tBuy");

    // Monitor top 8 rows
    for (var i = 0; i < 20; i++) {
        console.log((i + 1) + ". " + book._asks._entries[i].rate.toFixed(8) + " BTC\t" + book._asks._entries[i].amount.toFixed(8) + " ETH\t\t" + book._bids._entries[i].rate.toFixed(8) + " BTC\t" + book._bids._entries[i].amount.toFixed(8) + " ETH\t\t");
    }

    console.log("Spread: " + Math.abs(book._asks._entries[0].rate - book._bids._entries[0].rate).toFixed(8) + " BTC");
});

// Start tracking the order book
book.start();
