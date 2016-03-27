
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

// Current status of API connection
var connected = false;

// Handler for connection open event
connection.onopen = (session) => {
    // Set connected flag
    connected = true;
};

// Handler for connection close event
connection.onclose = (reason, details) => {
    // Clear connected flag
    connected = false;
    
};

// Connects to the push API
function connect() {
    // Don't try to connect if already so
    if (connected) {
        return;
    }
    
    // Open connection to push API
    connection.open();
}

// Disconnects from the push API
function disconnect() {
    // Don't try to disconnect if already so
    if (!connected) {
        return;
    }
    
    // Close connection to push API
    connection.close();
}

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

