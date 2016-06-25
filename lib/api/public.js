
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
var request = require("request");
var url = require("url");

// Public API wrapper constructor
var api = function() {};

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
    var queryUrl = url.parse("https://poloniex.com/public");

    // Add query to URL
    queryUrl.query = query;

    // Build options for request
    var opts = {
        "url": url.format(queryUrl),
        "method": "GET",
        "headers": {
            "User-Agent": "node-poloniex-unofficial|public.js (+https://git.io/polonode)"
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
 * function returnTicker(callback)
 *
 */
api.prototype.returnTicker = function(callback) {
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
 * function return24hVolume(callback)
 *
 */
api.prototype.return24hVolume = function(callback) {
    // Send return24hVolume query
    sendQuery(this, "return24hVolume", null, (err, response) => {
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
 * function returnOrderBook(currencyPair, depth, callback)
 *
 */
api.prototype.returnOrderBook = function(currencyPair, depth, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair || "all",
        "depth": depth
    };

    // Send returnOrderBook query
    sendQuery(this, "returnOrderBook", opts, (err, response) => {
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
 * function returnTradeHistory(currencyPair, start, end, callback)
 *
 */
api.prototype.returnTradeHistory = function(currencyPair, start, end, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair || "all",
        "start": start,
        "end": end
    };

    // Send returnTradeHistory query
    sendQuery(this, "returnTradeHistory", opts, (err, response) => {
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
 * function returnChartData(currencyPair, start, end, period, callback)
 *
 */
api.prototype.returnChartData = function(currencyPair, start, end, period, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair || "all",
        "start": start,
        "end": end,
        "period": period
    };

    // Send returnChartData query
    sendQuery(this, "returnChartData", opts, (err, response) => {
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
 * function returnCurrencies(callback)
 *
 */
api.prototype.returnCurrencies = function(callback) {
    // Send returnCurrencies query
    sendQuery(this, "returnCurrencies", null, (err, response) => {
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
 * function returnLoanOrders(currency, callback)
 *
 */
api.prototype.returnLoanOrders = function(currency, callback) {
    // Build query options
    var opts = {
        "currency": currency
    };

    // Send returnLoanOrders query
    sendQuery(this, "returnLoanOrders", opts, (err, response) => {
        if (err) {
            // Call back with error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            callback(null, response);
        }
    });
};

module.exports = api;