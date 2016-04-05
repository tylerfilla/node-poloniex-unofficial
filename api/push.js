
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
var autobahn = require("autobahn");

// Representation of the Poloniex push API
var apiPush = {};

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
 *                      err     An object of the following structure in the
 *                                  event of an error, or null if no error has
 *                                  occurred: { msg: "error message..." }
 *
 */
function connect(callback) {
    if (connection.isOpen) {
        // Call back if connected
        callback(null);
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
    // Only continue once connected
    connect((err) => {
        if (err) {
            // Notify caller of the error
            callback({"msg": "Error: " + err.msg}, null, null, null);
        } else {
            // Subscribe to the given feed
            connection.session.subscribe(feed, (args, kwargs, details) => callback(null, args, kwargs, details));
        }
    });
}

/*
 *
 * function ticker(callback)
 *
 * TODO: Write me
 *
 */
apiPush.ticker = function(callback) {
    // Subscribe to ticker feed
    subscribe("ticker", (err, args) => {
        if (err) {
            // Call back with decoupled error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with ticker data
            callback(null, {
                "raw": args,
                "currencyPair": args[0],
                "last": args[1],
                "lowestAsk": args[2],
                "highestBid": args[3],
                "percentChange": args[4],
                "baseVolume": args[5],
                "quoteVolume": args[6],
                "isFrozen": args[7],
                "_24hrHigh": args[8],
                "_24hrLow": args[9]
            });
        }
    });
}

/*
 *
 * function orderTrade(currencyPair, callback, allowBatches)
 *
 * TODO: Write me
 *
 */
apiPush.orderTrade = function(currencyPair, callback, allowBatches) {
    // Subscribe to currency pair feed (returns both new trades and order book updates)
    subscribe(currencyPair, (err, args) => {
        if (err) {
            // Call back with decoupled error info
            callback({"msg": err.msg}, null);
        } else {
            // FIXME(?): I am not taking Poloniex's sequence ID into account
            // here, as WAMP is inherently ordered. If Poloniex can identify
            // the order themselves, why would they not send updates in order?

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
                    updateParsed["amount"] = update.data.rate;
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
                callback(null, updateBatch);
            } else {
                // Call back once per individual update
                for (var i = 0; i < updateBatch.length; i++) {
                    callback(null, updateBatch[i]);
                }
            }
        }
    });
};

/*
 *
 * function trollbox(callback)
 *
 * TODO: Write me
 *
 */
apiPush.trollbox = function(callback) {
    // Subscribe to the trollbox feed
    subscribe("trollbox", (err, args) => {
        if (err) {
            // Call back with decoupled error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with trollbox data
            callback(null, {
                "raw": args,
                "type": args[0],
                "messageNumber": args[1],
                "username": args[2],
                "message": args[3],
                "reputation": args[4]
            });
        }
    });
}

/*
 *
 * function exports(params)
 *
 * Exposes the push API wrapper.
 *
 */
module.exports = function(params) {
    return apiPush;
}
