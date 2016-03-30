
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
 var crypto = require("crypto");
 var request = require("request");
 var url = require("url");

// Representation of the Poloniex trading API
var apiTrading = {};

// Container for authentication info (API key and secret)
var authInfo = {
    "key": null,
    "secret": null
};

/*
 *
 * function sendQuery(command, params, callback)
 *
 * TODO: Write me
 *
 */
function sendQuery(command, params, callback) {
    // Check for proper auth info
    if (!authInfo.key || !authInfo.secret) {
        // Call back with error
        callback({"msg": "Auth info not set"}, null);
        
        // We're done here
        return;
    }
    
    // Create query with given parameters, if applicable
    var query = params || {};
    
    // Add command to query
    if (!query.command) {
        query["command"] = command;
    }
    
    // Add nonce to query
    if (!query.nonce) {
        query["nonce"] = Date.now(); // TODO: Add method of modifying nonce
    }
    
    // A hacky way to not need any another dependencies
    var queryString = url.format({"query": query}).substring(1);
    
    // Options for request
    var opts = {
        "url": "https://poloniex.com/tradingApi",
        "method": "POST",
        "headers": {
            "User-Agent": "node-poloniex-unofficial|trading.js (+https://git.io/polonode)",
            "Content-Type": "application/x-www-form-urlencoded",
            "Key": authInfo.key,
            "Sign": crypto.createHmac("sha512", authInfo.secret).update(queryString).digest("hex")
        },
        "body": queryString
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
 * function returnBalances(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnBalances = function(callback) {
    // Send returnBalances query
    sendQuery("returnBalances", null, (err, response) => {
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
 * function returnCompleteBalances(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnCompleteBalances = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnDepositAddresses(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnDepositAddresses = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function generateNewAddress(currency, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.generateNewAddress = function(currency, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnDepositsWithdrawals(start, end, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnDepositsWithdrawals = function(start, end, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnOpenOrders(currencyPair, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnOpenOrders = function(currencyPair, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnTradeHistory(currencyPair, start, end, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnTradeHistory = function(currencyPair, start, end, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnOrderTrades(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnOrderTrades = function(orderNumber, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function buy(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.buy = function(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function sell(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.sell = function(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function cancelOrder(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.cancelOrder = function(orderNumber, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function moveOrder(orderNumber, rate, amount, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.moveOrder = function(orderNumber, rate, amount, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function withdraw(currency, amount, address, paymentId, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.withdraw = function(currency, amount, address, paymentId, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnFeeInfo(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnFeeInfo = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnAvailableAccountBalances(account, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnAvailableAccountBalances = function(account, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnTradableBalances(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnTradableBalances = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function transferBalance(currency, amount, fromAccount, toAccount, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.transferBalance = function(currency, amount, fromAccount, toAccount, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnMarginAccountSummary(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnMarginAccountSummary = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function marginBuy(currencyPair, rate, amount, lendingRate, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.marginBuy = function(currencyPair, rate, amount, lendingRate, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function marginSell(currencyPair, rate, amount, lendingRate, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.marginSell = function(currencyPair, rate, amount, lendingRate, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function getMarginPosition(currencyPair, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.getMarginPosition = function(currencyPair, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function closeMarginPosition(currencyPair, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.closeMarginPosition = function(currencyPair, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function createLoanOffer(currency, amount, duration, autoRenew, lendingRate, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.createLoanOffer = function(currency, amount, duration, autoRenew, lendingRate, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function cancelLoanOffer(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.cancelLoanOffer = function(orderNumber, callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnOpenLoanOffers(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnOpenLoanOffers = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function returnActiveLoans(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnActiveLoans = function(callback) {
    // TODO: Stuff goes here
}

/*
 *
 * function toggleAutoRenew(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.toggleAutoRenew = function(orderNumber, callback) {
    // TODO: Stuff goes here
}

// Export a function which returns apiTrading
module.exports = function(params) {
    // Get auth info from params
    authInfo.key = params.apiKey;
    authInfo.secret = params.apiSecret;
    
    return apiTrading;
}
