
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

// Interval (in ms) for testing openness of a session after a connection has been established
const SESSION_WAIT_TEST_INTERVAL = 250;

// Number of tries to wait for openness of a session
const SESSION_WAIT_TEST_LIMIT = 4;

// Import modules
var autobahn = require("autobahn");

// Representation of the Poloniex push API
var apiPush = {};

// Autobahn|JS connection object for push API (utilizes the WAMP protocol)
var connection = new autobahn.Connection({
    "url": "wss://api.poloniex.com",
    "realm": "realm1"
});

// Internally-routed callback sets for connection management events
var cxnCallbacksOpen = new Array();
var cxnCallbacksClose = new Array();

// Internal lookup table for linking subscriptions to callbacks
var subLinks = {};
var subLinksId = 0;

// Number of currently active subscriptions
var activeSubs = 0;

// Handle connection open event
connection.onopen = function(session) {
    // Loop through all open callbacks
    for (var i = 0; i < cxnCallbacksOpen.length; i++) {
        cxnCallbacksOpen[i](session);
    }
};

// Handle connection close event
connection.onclose = function(reason, details) {
    // Loop through all close callbacks
    for (var i = 0; i < cxnCallbacksClose.length; i++) {
        cxnCallbacksClose[i](reason, details);
    }
};

/*
 *
 * function connect(callback)
 *
 * Attempts to establish a connection. Success or failure, this function will
 * call back with a status report.
 *
 * Params
 *      callback    A callback function with the following params
 *                      err     An object of the following structure in the
 *                                  event of an error, or null if no error has
 *                                  occurred: { msg: "error message..." }
 *
 */
function connect(callback) {
    // Check if currently connected
    if (connection.isConnected) {
        // Check if session is currently open
        if (connection.session.isOpen) {
            // Call back if connected
            callback(null);
        } else {
            // Try again at a later time
            var trials = 0;
            var retryInterval = setInterval(function() {
                // Check if session is currently open
                if (connection.session.isOpen) {
                    // Clear the interval
                    clearInterval(retryInterval);

                    // Report back to caller
                    callback(null);
                } else {
                    // Check trial limit
                    if (++trials >= SESSION_WAIT_TEST_LIMIT) {
                        // Clear the interval
                        clearInterval(retryInterval);

                        // Notify caller of error
                        callback({"msg": "The session did not open in a timely manner"});
                    }
                }
            }, SESSION_WAIT_TEST_INTERVAL);
        }
    } else {
        // Function-to-be to clean up the following callbacks
        var doCleanup = null;

        // Set up handler for connection open event
        var onOpen = function() {
            // Clean up
            if (doCleanup) {
                doCleanup();
            }

            // Connected; call back
            callback(null);
        };

        // Set up handler for connection close event
        var onClose = function(reason, details) {
            // Clean up
            if (doCleanup) {
                doCleanup();
            }

            // The only reason we might have closed here is a first-time connect error; act accordingly
            if (reason == "unreachable") {
                callback({"msg": "Poloniex push API is unreachable"});
            } else {
                callback({"msg": "Something is seriously wrong right now (probably an Autobahn|JS error; take it up with them!)"});
            }
        };

        // Aforementioned cleanup function
        doCleanup = function() {
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
 * established, this function will attempt to do so.
 *
 * Params
 *      feed        A string specifying the desired feed
 *      callback    A callback function with the following params
 *                      err     An object of the following structure in the
 *                                  event of an error, or null if no error has
 *                                  occurred: { msg: "error message..." }
 *                      args    Directly-mapped WAMP event payload array
 *                      kwargs  Directly-mapped WAMP event payload object
 *                      details Directly-mapped WAMP event metadata
 *
 */
function subscribe(feed, callback) {
    // A unique-enough ID for this subscription
    var id = ++subLinksId;

    // Attempt to connect to push API
    connect((err) => {
        if (err) {
            // Notify caller of the connection error
            callback({"msg": "Error: " + err.msg}, null, null, null);
        } else {
            // Proxy for user-supplied callback
            var callbackProxy = (args, kwargs, details) => {
                // Execute user callback, checking return value for kill signal (anything not false)
                if (callback(null, args, kwargs, details)) {
                    // Unsubscribe
                    connection.session.unsubscribe(subLinks[id]);

                    // Remove internal reference
                    delete subLinks[id];

                    // Decrement active subscription counter
                    activeSubs--;

                    // If no subscriptions remain
                    if (activeSubs == 0) {
                        // Close the entire connection (allows program to exit naturally; can be reopened if needed)
                        connection.close();
                    }
                }
            };

            // Subscribe to the given feed
            connection.session.subscribe(feed, callbackProxy).then(
                (subscription) => {
                    // Register subscription
                    subLinks[id] = subscription;

                    // Increment active subscription counter
                    activeSubs++;
                },
                (err) => {
                    // Call back with error
                    callback({"msg": "Error: " + err}, null, null, null);
                }
            );
        }
    });
}

/*
 *
 * function ticker(callback)
 *
 * Subscribes to the ticker feed. All connection details are handled internally.
 *
 * Params
 *      callback    A callback function with the following params
 *                      err     An object of the following structure in the
 *                                  event of an error, or null if no error has
 *                                  occurred: { msg: "error message..." }
 *                      data    An object containing parsed ticker data
 *
 */
apiPush.ticker = function(callback) {
    // Subscribe to ticker feed
    subscribe("ticker", (err, args) => {
        if (err) {
            // Call back with decoupled error info
            return callback({"msg": err.msg}, null);
        } else {
            // Call back with ticker data
            return callback(null, {
                "raw": args,
                "currencyPair": args[0],
                "last": args[1],
                "lowestAsk": args[2],
                "highestBid": args[3],
                "percentChange": args[4],
                "baseVolume": args[5],
                "quoteVolume": args[6],
                "isFrozen": args[7],
                "24hrHigh": args[8],    //
                "24hrLow": args[9],     // NOTE: Actual names are syntactically
                "_24hrHigh": args[8],   // inaccessible via dot notation
                "_24hrLow": args[9]     //
            });
        }
    });
};

/*
 *
 * function orderTrade(currencyPair, callback, allowBatches)
 *
 * Subscribes to the order book and trade update feed for a specified trading
 * pair. All connection details are handled internally.
 *
 * Params
 *      currencyPair    A string containing a valid Poloniex trading pair
 *      callback        A callback function with the following params
 *                          err     An object of the following structure in the
 *                                      event of an error, or null if no error
 *                                      has occurred:
 *                                          { msg: "error message..." }
 *                          data    An object containing parsed order book and
 *                                      trade data
 *      allowBatches    A boolean value indicating whether updates may be
 *                          delivered in batches; that is, arrays of updates;
 *                          this behavior is opt-in and might increase
 *                          efficiency in certain cases
 *
 */
apiPush.orderTrade = function(currencyPair, callback, allowBatches) {
    // Subscribe to currency pair feed (returns both new trades and order book updates)
    subscribe(currencyPair, (err, args) => {
        if (err) {
            // Call back with decoupled error info
            return callback({"msg": err.msg}, null);
        } else {
            /*
             * FIXME(?): I am not taking Poloniex's sequence ID into account
             * here, as WAMP is inherently ordered. If Poloniex can identify the
             * order themselves, why would they not send updates in order?
             */

            // Update batch array
            var updateBatch = new Array();

            // Iterate over updates
            for (var i = 0; i < args.length; i++) {
                // Object for raw update data
                var update = args[i];

                // Object for parsed update data
                var updateParsed = {};

                // Store raw update data and type
                updateParsed["raw"] = update;
                updateParsed["updateType"] = update.type;

                // Decipher update data based on type
                switch (update.type) {
                case "orderBookModify":
                    updateParsed["type"] = update.data.type;
                    updateParsed["rate"] = update.data.rate;
                    updateParsed["amount"] = update.data.amount;
                    break;
                case "orderBookRemove":
                    updateParsed["type"] = update.data.type;
                    updateParsed["rate"] = update.data.rate;
                    break;
                case "newTrade":
                    updateParsed["amount"] = update.data.amount;
                    updateParsed["date"] = update.data.date;
                    updateParsed["rate"] = update.data.rate;
                    updateParsed["total"] = update.data.total;
                    updateParsed["tradeID"] = update.data.tradeID;
                    updateParsed["type"] = update.data.type;
                    break;
                }

                // Add parsed update to update batch array
                updateBatch.push(updateParsed);
            }

            // If batches are allowed
            if (allowBatches) {
                // Call back with entire update batch
                return callback(null, updateBatch);
            } else {
                // Cumulative OR of iterated callback returns (any one callback may unsubscribe)
                var retval;

                // Call back once per individual update
                for (var i = 0; i < updateBatch.length; i++) {
                    retval = retval || callback(null, updateBatch[i]);
                }

                return retval;
            }
        }
    });
};

/*
 *
 * function trollbox(callback)
 *
 * Subscribes to the trollbox feed. All connection details are handled
 * internally.
 *
 * Params
 *      callback    A callback function with the following params
 *                      err     An object of the following structure in the
 *                                  event of an error, or null if no error has
 *                                  occurred: { msg: "error message..." }
 *                      data    An object containing parsed trollbox data
 *
 */
apiPush.trollbox = function(callback) {
    // Subscribe to the trollbox feed
    subscribe("trollbox", (err, args) => {
        if (err) {
            // Call back with decoupled error info
            return callback({"msg": err.msg}, null);
        } else {
            // Call back with trollbox data
            return callback(null, {
                "raw": args,
                "type": args[0],
                "messageNumber": args[1],
                "username": args[2],
                "message": args[3],
                "reputation": args[4]
            });
        }
    });
};

/*
 *
 * function exports(params)
 *
 * Exposes the push API wrapper. This function is not meant for external use.
 *
 */
module.exports = function(params) {
    return apiPush;
};
