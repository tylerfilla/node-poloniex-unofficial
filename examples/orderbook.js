
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

// Create a new order book tracker for the USD-Bitcoin market
var book = new polo.OrderBook("USDT_BTC");

var syncsLost = 0;

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
    console.log("Lost API synchronization!");
    syncsLost++;
});

// Update events
book.onUpdate(() => {
    console.log("--------------------------------------------------------------------------------");
    console.log("Syncs lost: " + syncsLost);
    console.log("Sell\t\t\t\t\t\tBuy");

    // Monitor top 8 rows
    for (var i = 0; i < 8; i++) {
        console.log((i + 1) + ". " + book._asks._entries[i].rate.toFixed(8) + " USD\t" + book._asks._entries[i].amount.toFixed(8) + " BTC\t\t" + book._bids._entries[i].rate.toFixed(8) + " USD\t" + book._bids._entries[i].amount.toFixed(8) + " BTC\t\t");
    }

    console.log("Spread: " + Math.abs(book._asks._entries[0].rate - book._bids._entries[0].rate).toFixed(8) + " USD");
});

// Start tracking the order book
book.start();
