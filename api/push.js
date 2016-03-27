
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
        // TODO: Provide a better interface for currency pairs (to separate base from counter currency)
        
        // Subscribe to the order book
        connection.session.subscribe(currencyPair, (args) => {
            // FIXME: Yeah, do some parsing stuff here
            //        For now, just forward the received data and assume no errors occurred
            callback(null, args);
        });
    }
};

// Trollbox subscription function
apiPush.trollbox = (callback) => {
    // Try to connect to push API
    connectAndRetry(apiPush.trollbox, callback);
    
    // Continue if connection is open
    if (connection.isOpen) {
        connection.session.subscribe("trollbox", (args) => {
            // FIXME: Again, yeah
            callback(null, args);
        });
    }
};

// Export a function which returns apiPush
module.exports = () => apiPush;

