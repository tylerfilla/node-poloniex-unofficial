
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

// Import third-party modules
const autobahn = require("autobahn");

// Import local modules
const CurrencyPair = require("./../util/CurrencyPair.js");
const ParamUtils = require("./../common/ParamUtils.js");

// Poloniex push API websocket URL and WAMP realm
const POLONIEX_PUSH_URL = "wss://api.poloniex.com";
const POLONIEX_PUSH_REALM = "realm1";

// Interval (in ms) for testing openness of a session after a connection has been established
const SESSION_WAIT_TEST_INTERVAL = 250;

// Number of tries to wait for openness of a session
const SESSION_WAIT_TEST_LIMIT = 4;

/*
 * Push API wrapper constructor.
 */
function PushWrapper() {
    // Autobahn|JS connection object for push API (utilizes the WAMP protocol)
    this._connection = new autobahn.Connection({
        "url": POLONIEX_PUSH_URL,
        "realm": POLONIEX_PUSH_REALM
    });

    // Internally-routed callback sets for connection management events
    this._cxnCallbacksOpen = new Array();
    this._cxnCallbacksClose = new Array();

    // Internal lookup table for linking subscriptions to callbacks
    this._subLinks = {};
    this._subLinksId = 0;

    // Number of currently active subscriptions
    this._activeSubs = 0;

    // Handle connection open event
    this._connection.onopen = (session) => {
        // Loop through all open callbacks
        for (var i = 0; i < this._cxnCallbacksOpen.length; i++) {
            this._cxnCallbacksOpen[i](session);
        }
    };

    // Handle connection close event
    this._connection.onclose = (reason, details) => {
        // Loop through all close callbacks
        for (var i = 0; i < this._cxnCallbacksClose.length; i++) {
            this._cxnCallbacksClose[i](reason, details);
        }
    };
}

/*
 *
 * function connect(api, callback)
 *
 * Attempts to establish a connection. Success or failure, this function will
 * call back with a status report.
 *
 * Params
 *      api         Push wrapper instance being operated on
 *      callback    A callback function with the following params
 *                      err     An object of the following structure in the
 *                                  event of an error, or null if no error has
 *                                  occurred: { msg: "error message..." }
 *
 */
function connect(api, callback) {
    // Check if currently connected
    if (api._connection.isConnected) {
        // Check if session is currently open
        if (api._connection.session.isOpen) {
            // Call back if connected
            callback(null);
        } else {
            // Try again at a later time
            var trials = 0;
            var retryInterval = setInterval(function() {
                // Check if session is currently open
                if (api._connection.session.isOpen) {
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
        var doCleanup;

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
                callback({"msg": "Unexpected Autobahn|JS error", "evReason": reason, "evDetails": details});
            }
        };

        // Aforementioned cleanup function
        doCleanup = function() {
            // Remove callbacks from respective arrays
            api._cxnCallbacksOpen.splice(api._cxnCallbacksOpen.indexOf(onOpen), 1);
            api._cxnCallbacksClose.splice(api._cxnCallbacksClose.indexOf(onClose), 1);
        };

        // Publish the callbacks
        api._cxnCallbacksOpen.push(onOpen);
        api._cxnCallbacksClose.push(onClose);

        // Try to open connection
        api._connection.open();
    }
}

/*
 *
 * function subscribe(api, feed, callback)
 *
 * Subscribes to the given WAMP feed. If the connection has not yet been
 * established, this function will attempt to do so.
 *
 * Params
 *      api         Push wrapper instance being operated on
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
function subscribe(api, feed, callback) {
    // A unique-enough ID for this subscription
    var id = ++api._subLinksId;

    // Attempt to connect to push API
    connect(api, (err) => {
        if (err) {
            // Notify caller of the connection error
            callback({"msg": "Error: " + err.msg}, null, null, null);
        } else {
            // Proxy for user-supplied callback
            var callbackProxy = (args, kwargs, details) => {
                // Execute user callback, checking return value for kill signal (anything not false)
                if (callback(null, args, kwargs, details)) {
                    // Unsubscribe
                    api._connection.session.unsubscribe(api._subLinks[id]);

                    // Remove internal reference
                    delete api._subLinks[id];

                    // Decrement active subscription counter
                    api._activeSubs--;

                    // If no subscriptions remain
                    if (api._activeSubs == 0) {
                        // Close the entire connection (allows program to exit naturally; can be reopened if needed)
                        api._connection.close();
                    }
                }
            };

            // Subscribe to the given feed
            api._connection.session.subscribe(feed, callbackProxy).then(
                (subscription) => {
                    // Register subscription
                    api._subLinks[id] = subscription;

                    // Increment active subscription counter
                    api._activeSubs++;
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
 */
PushWrapper.prototype.ticker = function(callback) {
    // No params are necessary (yet) for ticker, but be flexible
    var params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        callback: "function"
    });

    // Subscribe to ticker feed
    subscribe(this, "ticker", (err, args) => {
        if (err) {
            // Call back with error info
            return params.callback({"msg": err.msg}, null);
        } else {
            // Call back with ticker data
            return params.callback(null, {
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
 * function orderTrade(params, callback)
 *
 * Subscribes to the order book and trade update feed for a specified trading
 * pair. All connection details are handled internally.
 *
 */
PushWrapper.prototype.orderTrade = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        allowBatches: {type: "boolean", opt: true},
        callback: "function"
    });

    // Get currency pair's string representation if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Subscribe to currency pair feed (returns both new trades and order book updates)
    subscribe(this, params.currencyPair, (err, args, kwargs) => {
        if (err) {
            // Call back with error info
            return params.callback({"msg": err.msg}, null);
        } else {
            // Update batch array
            var updateBatch = new Array();

            // Iterate over updates
            for (var i = 0; i < args.length; i++) {
                // Object for raw update data
                var update = args[i];

                // Object for parsed update data
                var updateParsed = {};

                // Store pair, raw data, and update type
                updateParsed["currencyPair"] = params.currencyPair;
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

                // Throw in seq number for public API correlation
                updateParsed["seq"] = kwargs.seq;

                // Add parsed update to update batch array
                updateBatch.push(updateParsed);
            }

            // If batches are allowed
            if (params.allowBatches) {
                // Call back with entire update batch
                return params.callback(null, updateBatch);
            } else {
                // Cumulative OR of iterated callback returns (any one callback may unsubscribe)
                var retval;

                // Call back once per individual update
                for (var i = 0; i < updateBatch.length; i++) {
                    retval = retval || params.callback(null, updateBatch[i]);
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
 */
PushWrapper.prototype.trollbox = function(callback) {
    // No params are necessary (yet) for trollbox, but be flexible
    var params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        callback: "function"
    });

    // Subscribe to the trollbox feed
    subscribe(this, "trollbox", (err, args) => {
        if (err) {
            // Call back with error info
            return params.callback({"msg": err.msg}, null);
        } else {
            // Call back with trollbox data
            return params.callback(null, {
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

module.exports = PushWrapper;
