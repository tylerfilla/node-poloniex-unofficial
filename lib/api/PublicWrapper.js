
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
const request = require("request");
const url = require("url");

// Poloniex public API URL
const POLONIEX_PUBLIC_URL = "https://poloniex.com/public";

// User-Agent for HTTP requests
const REQUEST_USER_AGENT = "node-poloniex-unofficial|public.js (+https://git.io/polonode)";

/*
 * Public API wrapper constructor.
 */
function PublicWrapper() {
}

/*
 *
 * function sendQuery(api, command, params, callback)
 *
 */
function sendQuery(api, command, params, callback) {
    // Create query with given parameters, if applicable
    var query = params || {};

    // Add command to query
    if (!query.command) {
        query["command"] = command;
    }

    // Parse public API URL
    var queryUrl = url.parse(POLONIEX_PUBLIC_URL);

    // Add query to URL
    queryUrl.query = query;

    // Build options for request
    var opts = {
        "url": url.format(queryUrl),
        "method": "GET",
        "headers": {
            "User-Agent": REQUEST_USER_AGENT
        }
    };

    // Send request to Poloniex
    request(opts, function(error, response, body) {
        if (!error && response && response.statusCode == 200) {
            // Parse body as JSON
            var bodyObj = JSON.parse(body);

            // Check if Poloniex returned an API error
            if (bodyObj.error) {
                // Call back with provided error info
                callback({"msg": "Poloniex: " + bodyObj.error}, null);
            } else {
                // Call back with parsed response
                callback(null, bodyObj);
            }
        } else {
            // Call back with error info
            callback({"msg": "Request failed", "reqError": error, "reqResponse": response}, null);
        }
    });
}

/*
 *
 * function loadCallback(params, callback, setFunc)
 *
 */
function loadCallback(params, callback, setFunc) {
    // If callback is in place of params
    if (typeof params == "function" && typeof callback == "undefined") {
        // Move callback to appropriate place
        callback = params;

        // Set params to a blank object (use a function to notify the caller)
        params = setFunc(callback);
    }

    // Set callback as a parameter if it is not already
    if (typeof params.callback == "undefined") {
        params.callback = callback;
    }
}

/*
 *
 * function expectParams(params, expects)
 *
 */
function expectParams(params, expects) {
    // If parameters are invalidly-typed
    if (params == null || typeof params != "object") {
        throw "Invalid parameters (this library now expects parameters to be packed)";
    }

    // A list of all unmet expectations
    var unmet = [];

    // Iterate over expectations
    for (var key in expects) {
        // Get actual type and expected type
        var typeParam = typeof params[key];
        var typeExpect = expects[key];

        // If expected type is an array of possibilities
        if (typeExpect instanceof Array) {
            // If actual type is within expected type array, just force typeExpect == typeParam
            typeExpect = typeExpect.indexOf(typeParam) > -1 ? typeParam : null;
        }

        // If actual and expected types do not match, record an appropriate message
        if (typeParam != typeExpect) {
            if (typeParam == "undefined") {
                unmet.push(`Expected parameter \"${key}\" of type ${typeExpect}`);
            } else {
                unmet.push(`Expected parameter \"${key}\" of type ${typeExpect}, but got ${typeParam}`);
            }
        }
    }

    // If problems were encountered, fail with compiled error message
    if (unmet.length > 1) {
        throw unmet.join("\n");
    }
}

/*
 *
 * function returnTicker(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnTicker = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        callback: "function"
    });

    // Send returnTicker query
    sendQuery(this, "returnTicker", null, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

/*
 *
 * function return24hVolume(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.return24hVolume = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        callback: "function"
    });

    // Send return24hVolume query
    sendQuery(this, "return24hVolume", null, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

/*
 *
 * function returnOrderBook(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnOrderBook = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        currencyPair: "string", // TODO: Also support CurrencyPair object
        depth: "number",
        callback: "function"
    });

    // Build query options
    var opts = {
        currencyPair: params.currencyPair,
        depth: params.depth
    };

    // Send returnOrderBook query
    sendQuery(this, "returnOrderBook", opts, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

/*
 *
 * function returnTradeHistory(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnTradeHistory = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        currencyPair: "string", // TODO
        start: "number",
        end: "number",
        callback: "function"
    });

    // Build query options
    var opts = {
        currencyPair: params.currencyPair,
        start: params.start,
        end: params.end
    };

    // Send returnTradeHistory query
    sendQuery(this, "returnTradeHistory", opts, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

/*
 *
 * function returnChartData(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnChartData = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        currencyPair: "string", // TODO
        start: "number",
        end: "number",
        period: "number",
        callback: "function"
    });

    // Build query options
    var opts = {
        currencyPair: params.currencyPair,
        start: params.start,
        end: params.end,
        period: params.period
    };

    // Send returnChartData query
    sendQuery(this, "returnChartData", opts, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

/*
 *
 * function returnCurrencies(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnCurrencies = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        callback: "function"
    });

    // Send returnCurrencies query
    sendQuery(this, "returnCurrencies", null, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

/*
 *
 * function returnLoanOrders(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnLoanOrders = function(params, callback) {
    // Load callback into params, if necessary
    loadCallback(params, callback, c => params = {});

    // Assert parameter expectations
    expectParams(params, {
        currency: "string",
        callback: "function"
    });

    // Build query options
    var opts = {
        currency: params.currency
    };

    // Send returnLoanOrders query
    sendQuery(this, "returnLoanOrders", opts, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

module.exports = PublicWrapper;
