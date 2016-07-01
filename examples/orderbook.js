
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
var syncing = false;

// Lifecycle events
book.onStop(err => {
    // If stop is caused by an error
    if (err) {
        console.log("An error occurred: " + err.msg);
    }

    console.log("Stopping...");
});

// Sync events
book.onSyncBegin(() => {
    syncing = true;
});
book.onSyncComplete(() => {
    syncing = false;
});
book.onSyncLost(() => {
    syncsLost++;
});

// Update event
book.onUpdate(() => {
    updates++;

    console.log("--------------------------------------------------------------------------------");

    if (syncing) {
        console.log("Resynchronizing...");
    } else {
        console.log("Updates Received: " + updates + " / Updates in Buffer: " + book.getUpdateBufferSize() + " / Total Sync Losses: " + syncsLost + " (" + (100 * syncsLost / (updates + syncsLost)).toFixed(2) + "%)");
    }

    console.log("Sell\t\t\t\t\t\tBuy");

    // Monitor top 8 rows
    for (var i = 0; i < 18; i++) {
        var ask = book.getAskAt(i);
        var bid = book.getBidAt(i);

        console.log((i + 1) + ". " + ask.getRate().toFixed(8) + " BTC\t" + ask.getAmount().toFixed(8) + " ETH\t\t" + bid.getRate().toFixed(8) + " BTC\t" + bid.getAmount().toFixed(8) + " ETH\t\t");
    }

    console.log("Spread: " + book.getMetrics().spread.toFixed(8) + " BTC");
    console.log("Total asks: " + book.getMetrics().askSumAmount.toFixed(8) + " ETH");
    console.log("Total bids: " + book.getMetrics().bidSumTotal.toFixed(8) + " BTC");
});

console.log("Please wait...");

// Start tracking the order book
book.start();
