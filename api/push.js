
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

// Autobahn|JS connection object for push API (utilizes the WAMP protocol)
var connection = new autobahn.Connection({
    "url": "wss://api.poloniex.com",
    "realm": "realm1"
});

// Helper function to open connection and retry a function with a callback
function connectAndRetry(retry, callback) {
    // Check if connection is not yet open
    if (!connection.isOpen) {
        // Register a callback to retry this function
        connection.onopen = (session) => {
            // Retry on successful connection
            retry(callback);
        }
        
        // Attempt to open the connection
        connection.open();
    }
}

// Representation of the Poloniex push API
var apiPush = {};

// Ticker subscription function
apiPush.ticker = (callback) => {
    // Try to connect to push API
    connectAndRetry(apiPush.ticker, callback);
    
    // Continue if connection is open
    if (connection.isOpen) {
        // Subscribe to the ticker
        connection.session.subscribe("ticker", (args) => {
            // FIXME: Parse the JSON input
            callback(null, args);
        });
    }
};

// Order book subscription function
apiPush.orderBook = (currencyPair, callback) => {
    // Try to connect to push API
    connectAndRetry(apiPush.orderBook, callback);
    
    // Continue if connection is open
    if (connection.isOpen) {
        // TODO: Stuff goes here
    }
};

// Trollbox subscription function
apiPush.trollbox = (callback) => {
    // Try to connect to push API
    connectAndRetry(apiPush.trollbox, callback);
    
    // Continue if connection is open
    if (connection.isOpen) {
        // TODO: Stuff goes here
    }
};

// Export a function which returns apiPush
module.exports = () => apiPush;

