
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
 * function expectParams(params, expects)
 *
 */
function expectParams(params, expects) {
    // If parameters are invalidly-typed
    if (params == null || typeof params !== "object") {
        throw "Invalid parameters";
    }

    // Iterate over expectations
    for (var key in expects) {
        // Get actual type and expected type
        var typeParam = typeof params[key];
        var typeExpect = expects[key];

        // If expected type is a function (for more complex matching)
        if (typeof typeExpect === "function") {
            // Evaluate expected type function
            typeExpect = typeExpect(typeParam) ? typeParam : null;
        }

        // If actual and expected types do not match, fail
        if (typeParam !== typeExpect) {
            throw `Expected parameter \"${key}\" of type ${expects[key]}, but got ${params[key]}`;
        }
    }
}

/*
 *
 * function returnTicker(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnTicker = function(params) {
    // Assert parameter expectations
    expectParams(params, {
        callback: "function"
    });

    // Unpack parameters
    var callback = params.callback;

    // Send returnTicker query
    sendQuery(this, "returnTicker", null, (err, response) => {
        if (err) {
            // Call back with error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            callback(null, response);
        }
    });
};

/*
 *
 * function return24hVolume(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.return24hVolume = function(params) {
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
 * function returnOrderBook(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnOrderBook = function(params) {
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
 * function returnTradeHistory(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnTradeHistory = function(params) {
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
 * function returnChartData(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnChartData = function(params) {
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
 * function returnCurrencies(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnCurrencies = function(params) {
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
 * function returnLoanOrders(params)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnLoanOrders = function(params) {
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
