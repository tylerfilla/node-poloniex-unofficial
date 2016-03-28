
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

// Internally-routed callbacks for connection events
var cxnCallbacksOpen = new Array();
var cxnCallbacksClose = new Array();

// Handle connection open event
connection.onopen = function(session) {
    // Loop through all open callbacks
    for (var i = 0; i < cxnCallbacksOpen.length; i++) {
        cxnCallbacksOpen[i](session);
    }
}

// Handle connection close event
connection.onclose = function(reason, details) {
    // Loop through all close callbacks
    for (var i = 0; i < cxnCallbacksClose.length; i++) {
        cxnCallbacksClose[i](reason, details);
    }
}

/*
 *
 * function connect(callback)
 *
 * Attempts to establish a connection. Success or failure, this function will
 * call back with a status report.
 *
 * Params
 *      callback    A callback function with the following params
 *                      error   An object of the following structure, or null
 *                                  { msg: "error message..." }
 *
 */
function connect(callback) {
    if (connection.isOpen) {
        // Call back if connected
        callback(null);
    } else {
        // Function-to-be to clean up the following callbacks
        var cleanup;
        
        // Set up handler for connection open event
        var onOpen = function() {
            // Cleanup
            cleanup();
            
            // Connected; call back
            callback(null);
        };
        
        // Set up handler for connection close event
        var onClose = function(reason, details) {
            // Cleanup
            cleanup();
            
            // The only reason we would have closed here is a first-time connect error (either unreachable or unsupported)
            switch (reason) {
            case "unreachable":
                callback({
                    "msg": "Poloniex push API is unreachable"
                });
                break;
            case "unsupported":
                callback({
                    "msg": "Something is seriously wrong right now (internal Autobahn|JS error; take it up with them)"
                });
                break;
            }
        };
        
        // Aforementioned cleanup function
        cleanup = function() {
            // Remove callbacks from respective arrays
            cxnCallbacksOpen.splice(cxnCallbacksOpen.indexOf(onOpen), 1);
            cxnCallbacksClose.splice(cxnCallbacksClose.indexOf(onClose), 1);
        };
        
        // Publish the callbacks
        cxnCallbacksOpen.push(onOpen);
        cxnCallbacksClose.push(onClose);
        
        // Try to open connection
        connection.open();
    }
}

// Representation of the Poloniex push API
var apiPush = {};

// Ticker subscription function
apiPush.ticker = function(callback) {
    // Only continue once connected
    connect((error) => {
        if (error) {
            // Notify caller of the error
            callback({
                "msg": "Error: " + error.msg
            }, null);
        } else {
            // Subscribe to the ticker feed
            connection.session.subscribe("ticker", (args) => {
                // TODO: Process received data
                callback(null, args);
            });
        }
    });
};

// Order book subscription function
apiPush.orderBook = function(currencyPair, callback) {
    // Only continue once connected
    connect((error) => {
        if (error) {
            // Notify caller of the error
            callback({
                "msg": "Error: " + error.msg
            }, null);
        } else {
            // Subscribe to the order book feed
            connection.session.subscribe(currencyPair, (args) => {
                // TODO: Process received data
                callback(null, args);
            });
        }
    });
};

// Trollbox subscription function
apiPush.trollbox = function(callback) {
    // Only continue once connected
    connect((error) => {
        if (error) {
            // Notify caller of the error
            callback({
                "msg": "Error: " + error.msg
            }, null);
        } else {
            // Subscribe to the trollbox feed
            connection.session.subscribe("trollbox", (args) => {
                // TODO: Process received data
                callback(null, args);
            });
        }
    });
};

// Export a function which returns apiPush
module.exports = () => apiPush;

