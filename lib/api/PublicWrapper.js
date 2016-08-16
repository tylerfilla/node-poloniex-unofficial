
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

"use strict";

// Import third-party modules
const request = require("request");
const url = require("url");

// Import local modules
const CurrencyPair = require("./../util/CurrencyPair.js");
const ParamUtils = require("./../common/ParamUtils.js");

// Poloniex public API URL
const POLONIEX_PUBLIC_URL = "https://poloniex.com/public";

// User-Agent for HTTP requests
const REQUEST_USER_AGENT = "node-poloniex-unofficial|PublicWrapper.js (+https://git.io/polonode)";

/*
 * Public API wrapper constructor.
 */
function PublicWrapper() {
}

/*
 *
 * function sendQuery(api, command, params)
 *
 */
function sendQuery(api, command, params) {
    // Create query with given parameters, if applicable
    let query = params || {};

    // Add command to query
    if (!query.command) {
        query["command"] = command;
    }

    // Parse public API URL
    let queryUrl = url.parse(POLONIEX_PUBLIC_URL);

    // Add query to URL
    queryUrl.query = query;

    // Build options for request
    let opts = {
        "url": url.format(queryUrl),
        "method": "GET",
        "headers": {
            "User-Agent": REQUEST_USER_AGENT
        }
    };

    // Return a promise for the request data
    return new Promise((resolve, reject) => {
        // Send request to Poloniex
        request(opts, (error, response, body) => {
            // If request was successful
            if (!error && response && response.statusCode == 200) {
                // Parsed response body
                let bodyParsed;

                // Try to parse response body as JSON
                try {
                    bodyParsed = JSON.parse(body);
                } catch (e) {
                    reject({msg: "Unable to parse response body: " + e, _body: body});
                    return;
                }

                // Enforce type of returned data (see issue #16)
                if (bodyParsed === null || typeof bodyParsed !== "object") {
                    reject({msg: "Response body parsed, but to null or wrong type", _bodyParsed: bodyParsed});
                    return;
                }

                // Check if Poloniex returned an error
                if (typeof bodyParsed.error !== "undefined") {
                    // Reject promise with Poloniex's error message
                    reject({msg: "Poloniex: " + bodyParsed.error});
                } else {
                    // Resolve with parsed response data
                    resolve(bodyParsed);
                }
            } else {
                // Reject promise with error info
                reject({msg: "API request failed", _requestError: error, _requestResponse: response});
            }
        });
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
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnTicker query
    return sendQuery(this, "returnTicker", null).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
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
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send return24hVolume query
    return sendQuery(this, "return24hVolume", null).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
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
        depth: ["number", "string"]
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        depth: params.depth
    };

    // Send returnOrderBook query
    return sendQuery(this, "returnOrderBook", opts).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
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
        start: ["number", "string"],
        end: ["number", "string"]
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        start: params.start,
        end: params.end
    };

    // Send returnTradeHistory query
    return sendQuery(this, "returnTradeHistory", opts).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
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
        start: ["number", "string"],
        end: ["number", "string"],
        period: ["number", "string"]
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        start: params.start,
        end: params.end,
        period: params.period
    };

    // Send returnChartData query
    return sendQuery(this, "returnChartData", opts).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
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
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnCurrencies query
    return sendQuery(this, "returnCurrencies", null).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
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
    let opts = {
        currency: params.currency
    };

    // Send returnLoanOrders query
    return sendQuery(this, "returnLoanOrders", opts).then(res => {
        if (typeof params.callback !== "undefined") {
            params.callback(null, res);
        }
        return res;
    }).catch(err => {
        if (typeof params.callback !== "undefined") {
            params.callback(err, null);
        }
        return err;
    });
};

module.exports = PublicWrapper;
