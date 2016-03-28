
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
            
            // The only reason we might have closed here is a first-time connect error; act accordingly
            switch (reason) {
            case "unreachable":
                callback({"msg": "Poloniex push API is unreachable"});
                break;
            case "unsupported":
                callback({"msg": "Something is seriously wrong right now (probably an Autobahn|JS error; take it up with them!)"});
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

/*
 *
 * function subscribe(feed, callback)
 *
 * Subscribes to the given WAMP feed. If the connection has not yet been
 * established, this function will utilize connect(...) to attempt to do so.
 *
 * Params
 *      feed        A string specifying the desired feed
 *      callback    A callback function with the following params
 *                      err   An object of the following structure, or null
 *                                  { msg: "error message..." }
 *
 */
function subscribe(feed, callback) {
    // Only continue once connected
    connect((err) => {
        if (err) {
            // Notify caller of the error
            callback({"msg": "Error: " + err.msg}, null);
        } else {
            // Subscribe to the given feed
            connection.session.subscribe(feed, (args) => callback(null, args));
        }
    });
}

// Representation of the Poloniex push API
var apiPush = {};

// Push API subscription functionality
apiPush.ticker    = (callback)               => subscribe("ticker",     callback);
apiPush.orderBook = (currencyPair, callback) => subscribe(currencyPair, callback);
apiPush.trollbox  = (callback)               => subscribe("trollbox",   callback);

// Export a function which returns apiPush
module.exports = () => apiPush;

