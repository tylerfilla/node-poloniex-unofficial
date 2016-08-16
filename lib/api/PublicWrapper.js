
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
const request = require("request");
const url = require("url");

// Import local modules
const CurrencyPair = require("./../util/CurrencyPair.js");
const ParamUtils = require("./../common/ParamUtils.js");

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
    request(opts, (error, response, body) => {
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
 * function returnTicker(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnTicker = function(callback) {
    // No extra parameters are necessary yet
    var params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

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
 * function return24hVolume(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.return24hVolume = function(callback) {
    // No extra parameters are necessary yet
    var params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

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
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        depth: "number"
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
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
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        start: "number",
        end: "number"
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
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
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        start: "number",
        end: "number",
        period: "number"
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
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
 * function returnCurrencies(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
PublicWrapper.prototype.returnCurrencies = function(callback) {
    // No extra parameters are necessary yet
    var params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

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
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currency: "string"
    });

    // Include required parameters
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
