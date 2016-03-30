
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

// Representation of the Poloniex public API
var apiPublic = {};

/*
 *
 * function sendQuery(command, params, callback)
 *
 * TODO: Write me
 *
 */
function sendQuery(command, params, callback) {
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
            "User-Agent": "node-poloniex-unofficial (+https://git.io/polonode)",
        },
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
 * TODO: Write me
 *
 */
apiPublic.returnTicker = function(callback) {
    // Send returnTicker query
    sendQuery("returnTicker", null, (err, response) => {
        if (err) {
            // Call back with decoupled error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            callback(null, response);
        }
    });
}

/*
 *
 * function return24hVolume(callback)
 *
 * TODO: Write me
 *
 */
apiPublic.return24hVolume = function(callback) {
    // Send return24hVolume query
    sendQuery("return24hVolume", null, (err, response) => {
        if (err) {
            // Call back with decoupled error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            callback(null, response);
        }
    });
}

/*
 *
 * function returnOrderBook()
 *
 * TODO: Write me
 *
 */
apiPublic.returnOrderBook = function() {
    // TODO: Stuff goes here
}

/*
 *
 * function returnTradeHistory()
 *
 * TODO: Write me
 *
 */
apiPublic.returnTradeHistory = function() {
    // TODO: Stuff goes here
}

/*
 *
 * function returnChartData()
 *
 * TODO: Write me
 *
 */
apiPublic.returnChartData = function() {
    // TODO: Stuff goes here
}

/*
 *
 * function returnCurrencies(callback)
 *
 * TODO: Write me
 *
 */
apiPublic.returnCurrencies = function(callback) {
    // Send returnCurrencies query
    sendQuery("returnCurrencies", null, (err, response) => {
        if (err) {
            // Call back with decoupled error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            callback(null, response);
        }
    });
}

/*
 *
 * function returnLoanOrders()
 *
 * TODO: Write me
 *
 */
apiPublic.returnLoanOrders = function() {
    // TODO: Stuff goes here
}

// Export a function which returns apiPublic
module.exports = () => apiPublic;
