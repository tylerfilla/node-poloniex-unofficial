
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
 * function sendQuery(command, params)
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
        if (!error && response.statusCode == 200) {
            // Call back with parsed response
            callback(null, JSON.parse(body));
        } else {
            // Call back with error info
            callback({"msg": "Request failed", "reqError": error, "reqResponse": response}, null);
        }
    });
}

/*
 *
 * function returnTicker()
 *
 * TODO: Write me
 *
 */
apiPublic.returnTicker = function() {
    // TODO: Stuff goes here
    
    sendQuery("returnTicker", null, (err, response) => {
        console.log(response);
    });
}

/*
 *
 * function return24Volume()
 *
 * TODO: Write me
 *
 */
apiPublic.return24Volume = function() {
    // TODO: Stuff goes here
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
 * function returnCurrencies()
 *
 * TODO: Write me
 *
 */
apiPublic.returnCurrencies = function() {
    // TODO: Stuff goes here
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
