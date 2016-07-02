
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
const polo = require("./../../");

// Create a new order book tracker for the Bitcoin-Ethereum market
const book = new polo.OrderBook("BTC_ETH");

// Lifecycle events
book.onStart(() => {
    console.log("Starting up...");
});
book.onStop(err => {
    // If stop is caused by an error
    if (err) {
        console.log("An error occurred: " + err.msg);
    }

    console.log("Stopping...");
});

// Update event
book.onUpdate(() => {
    console.log("Sell\t\t\t\t\tBuy");
    console.log("--------------------------------------------------------------------------------");

    // Monitor top few rows to match a standard 80x24 console
    for (var i = 0; i < 18; i++) {
        var ask = book.getAskAt(i);
        var bid = book.getBidAt(i);

        console.log(ask.getRate().toFixed(8) + " BTC\t" + ask.getAmount().toFixed(8) + " ETH\t" + (ask.getAmount().toFixed(8).length > 11 ? "" : "\t") + bid.getRate().toFixed(8) + " BTC\t" + bid.getAmount().toFixed(8) + " ETH\t\t");
    }

    console.log("--------------------------------------------------------------------------------");
    console.log("Spread: " + book.getMetrics().spread.toFixed(8) + " BTC");
    console.log("Total asks: " + book.getMetrics().askSumAmount.toFixed(8) + " ETH");
    console.log("Total bids: " + book.getMetrics().bidSumTotal.toFixed(8) + " BTC");
});

// Start tracking the order book
book.start();
