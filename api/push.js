
/*
 *
 * poloniex-unofficial
 *
 * Yet another unofficial wrapper for the Poloniex cryptocurrency exchange APIs
 * on Node.js
 *
 */

// Import modules
var autobahn = require("autobahn");

// Push API URL
var URL_POLONIEX_API_PUSH = "wss://api.poloniex.com";

// Representation of the Poloniex push API
var apiPush = {};

// Ticker subscription function
apiPush.ticker = (callback) => {
    // TODO: Stuff goes here
};

// Order book subscription function
apiPush.orderBook = (currencyPair, callback) => {
    // TODO: Stuff goes here
};

// Trollbox subscription function
apiPush.trollbox = (callback) => {
    // TODO: Stuff goes here
};

// Export a function which returns apiPush
module.exports = () => apiPush;

