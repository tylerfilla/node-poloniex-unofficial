
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
    // Send returnCompleteBalances query
    sendQuery("returnCompleteBalances", null, (err, response) => {
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
 * function returnDepositAddresses(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnDepositAddresses = function(callback) {
    // Send returnDepositAddresses query
    sendQuery("returnDepositAddresses", null, (err, response) => {
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
 * function generateNewAddress(currency, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.generateNewAddress = function(currency, callback) {
    // Build query options
    var opts = {
        "currency": currency
    };

    // Send generateNewAddress query
    sendQuery("generateNewAddress", opts, (err, response) => {
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
 * function returnDepositsWithdrawals(start, end, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnDepositsWithdrawals = function(start, end, callback) {
    // Build query options
    var opts = {
        "start": start,
        "end": end
    };

    // Send returnDepositsWithdrawals query
    sendQuery("returnDepositsWithdrawals", opts, (err, response) => {
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
 * function returnOpenOrders(currencyPair, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnOpenOrders = function(currencyPair, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair
    };

    // Send returnOpenOrders query
    sendQuery("returnOpenOrders", opts, (err, response) => {
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
 * function returnTradeHistory(currencyPair, start, end, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnTradeHistory = function(currencyPair, start, end, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "start": start,
        "end": end
    };

    // Send returnTradeHistory query
    sendQuery("returnTradeHistory", opts, (err, response) => {
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
 * function returnOrderTrades(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnOrderTrades = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send returnOrderTrades query
    sendQuery("returnOrderTrades", opts, (err, response) => {
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
 * function buy(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.buy = function(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "fillOrKill": fillOrKill,
        "immediateOrCancel": immediateOrCancel
    };

    // Send buy query
    sendQuery("buy", opts, (err, response) => {
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
 * function sell(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.sell = function(currencyPair, rate, amount, fillOrKill, immediateOrCancel, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "fillOrKill": fillOrKill,
        "immediateOrCancel": immediateOrCancel
    };

    // Send sell query
    sendQuery("sell", opts, (err, response) => {
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
 * function cancelOrder(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.cancelOrder = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send cancelOrder query
    sendQuery("cancelOrder", opts, (err, response) => {
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
 * function moveOrder(orderNumber, rate, amount, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.moveOrder = function(orderNumber, rate, amount, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber,
        "rate": rate,
        "amount": amount
    };

    // Send moveOrder query
    sendQuery("moveOrder", opts, (err, response) => {
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
 * function withdraw(currency, amount, address, paymentId, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.withdraw = function(currency, amount, address, paymentId, callback) {
    // Build query options
    var opts = {
        "currency": currency,
        "amount": amount,
        "address": address,
        "paymentId": paymentId
    };

    // Send withdraw query
    sendQuery("withdraw", opts, (err, response) => {
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
 * function returnFeeInfo(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnFeeInfo = function(callback) {
    // Send returnFeeInfo query
    sendQuery("returnFeeInfo", null, (err, response) => {
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
 * function returnAvailableAccountBalances(account, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnAvailableAccountBalances = function(account, callback) {
    // Build query options
    var opts = {
        "account": account
    };

    // Send returnAvailableAccountBalances query
    sendQuery("returnAvailableAccountBalances", opts, (err, response) => {
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
 * function returnTradableBalances(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnTradableBalances = function(callback) {
    // Send returnTradableBalances query
    sendQuery("returnTradableBalances", null, (err, response) => {
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
 * function transferBalance(currency, amount, fromAccount, toAccount, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.transferBalance = function(currency, amount, fromAccount, toAccount, callback) {
    // Build query options
    var opts = {
        "currency": currency,
        "amount": amount,
        "fromAccount": fromAccount,
        "toAccount": toAccount
    };

    // Send transferBalance query
    sendQuery("transferBalance", opts, (err, response) => {
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
 * function returnMarginAccountSummary(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnMarginAccountSummary = function(callback) {
    // Send returnMarginAccountSummary query
    sendQuery("returnMarginAccountSummary", null, (err, response) => {
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
 * function marginBuy(currencyPair, rate, amount, lendingRate, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.marginBuy = function(currencyPair, rate, amount, lendingRate, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "lendingRate": lendingRate
    };

    // Send marginBuy query
    sendQuery("marginBuy", opts, (err, response) => {
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
 * function marginSell(currencyPair, rate, amount, lendingRate, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.marginSell = function(currencyPair, rate, amount, lendingRate, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "lendingRate": lendingRate
    };

    // Send marginSell query
    sendQuery("marginSell", opts, (err, response) => {
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
 * function getMarginPosition(currencyPair, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.getMarginPosition = function(currencyPair, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair
    };

    // Send getMarginPosition query
    sendQuery("getMarginPosition", opts, (err, response) => {
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
 * function closeMarginPosition(currencyPair, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.closeMarginPosition = function(currencyPair, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair
    };

    // Send closeMarginPosition query
    sendQuery("closeMarginPosition", opts, (err, response) => {
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
 * function createLoanOffer(currency, amount, duration, autoRenew, lendingRate, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.createLoanOffer = function(currency, amount, duration, autoRenew, lendingRate, callback) {
    // Build query options
    var opts = {
        "currency": currency,
        "amount": amount,
        "duration": duration,
        "autoRenew": autoRenew,
        "lendingRate": lendingRate
    };

    // Send createLoanOffer query
    sendQuery("createLoanOffer", opts, (err, response) => {
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
 * function cancelLoanOffer(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.cancelLoanOffer = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send cancelLoanOffer query
    sendQuery("cancelLoanOffer", opts, (err, response) => {
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
 * function returnOpenLoanOffers(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnOpenLoanOffers = function(callback) {
    // Send returnOpenLoanOffers query
    sendQuery("returnOpenLoanOffers", null, (err, response) => {
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
 * function returnActiveLoans(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnActiveLoans = function(callback) {
    // Send returnActiveLoans query
    sendQuery("returnActiveLoans", null, (err, response) => {
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
 * function toggleAutoRenew(orderNumber, callback)
 *
 * TODO: Write me
 *
 */
apiTrading.toggleAutoRenew = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send toggleAutoRenew query
    sendQuery("toggleAutoRenew", opts, (err, response) => {
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
 * function exports(params)
 *
 * Accepts API authentication info and exposes the trading API wrapper.
 *
 */
module.exports = function(params) {
    // Get auth info from params (FIXME: do not put auth params in global scope; one might want to access multiple accounts)
    authInfo.key = params.key;
    authInfo.secret = params.secret;

    return apiTrading;
}
