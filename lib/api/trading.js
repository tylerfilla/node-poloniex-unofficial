
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

// Poloniex trading API URL
const POLONIEX_TRADING_URL = "https://poloniex.com/tradingApi";

// User-Agent for HTTP requests
const REQUEST_USER_AGENT = "node-poloniex-unofficial|trading.js (+https://git.io/polonode)";

/*
 * Trading API wrapper constructor.
 */
function TradingWrapper(apiKey, apiSecret, nonceGen) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.nonceGen = nonceGen;
}

/*
 *
 * function sendQuery(api, command, params, callback)
 *
 */
function sendQuery(api, command, params, callback) {
    // Check for auth info
    if (!api.apiKey || !api.apiSecret) {
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
        // Get nonce from user-supplied function if available, but fall back to Date.now
        query["nonce"] = (api.nonceGen || Date.now)();
    }

    // A bit hacky, but it won't break any time soon
    var queryString = url.format({"query": query}).substring(1);

    // Options for request
    var opts = {
        "url": POLONIEX_TRADING_URL,
        "method": "POST",
        "headers": {
            "User-Agent": REQUEST_USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
            "Key": api.apiKey,
            "Sign": crypto.createHmac("sha512", api.apiSecret).update(queryString).digest("hex")
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
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnBalances = function(callback) {
    // Send returnBalances query
    sendQuery(this, "returnBalances", null, (err, response) => {
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
 * function returnCompleteBalances([account, ]callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnCompleteBalances = function(account, callback) {
    // Backwards-incompatibility workaround
    if (typeof account === "function") {
        callback = account;
        account = null;
    }

    // Build query options
    var opts = {};

    // Add optional parameters
    if (account) {
        opts.account = account;
    }

    // Send returnCompleteBalances query
    sendQuery(this, "returnCompleteBalances", opts, (err, response) => {
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
 * function returnDepositAddresses(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnDepositAddresses = function(callback) {
    // Send returnDepositAddresses query
    sendQuery(this, "returnDepositAddresses", null, (err, response) => {
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
 * function generateNewAddress(currency, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.generateNewAddress = function(currency, callback) {
    // Build query options
    var opts = {
        "currency": currency
    };

    // Send generateNewAddress query
    sendQuery(this, "generateNewAddress", opts, (err, response) => {
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
 * function returnDepositsWithdrawals(start, end, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnDepositsWithdrawals = function(start, end, callback) {
    // Build query options
    var opts = {
        "start": start,
        "end": end
    };

    // Send returnDepositsWithdrawals query
    sendQuery(this, "returnDepositsWithdrawals", opts, (err, response) => {
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
 * function returnOpenOrders(currencyPair, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnOpenOrders = function(currencyPair, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair
    };

    // Send returnOpenOrders query
    sendQuery(this, "returnOpenOrders", opts, (err, response) => {
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
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnTradeHistory = function(currencyPair, start, end, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
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
 * function returnOrderTrades(orderNumber, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnOrderTrades = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send returnOrderTrades query
    sendQuery(this, "returnOrderTrades", opts, (err, response) => {
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
 * function buy(currencyPair, rate, amount, fillOrKill, immediateOrCancel, [postOnly,] callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.buy = function(currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly, callback) {
    // Backwards-incompatibility workaround
    if (typeof postOnly === "function") {
        callback = postOnly;
        postOnly = null;
    }

    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "fillOrKill": fillOrKill,
        "immediateOrCancel": immediateOrCancel
    };

    // Add optional parameters
    if (postOnly) {
        opts.postOnly = postOnly;
    }

    // Send buy query
    sendQuery(this, "buy", opts, (err, response) => {
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
 * function sell(currencyPair, rate, amount, fillOrKill, immediateOrCancel, [postOnly,] callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.sell = function(currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly, callback) {
    // Backwards-incompatibility workaround
    if (typeof postOnly === "function") {
        callback = postOnly;
        postOnly = null;
    }

    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "fillOrKill": fillOrKill,
        "immediateOrCancel": immediateOrCancel
    };

    // Add optional parameters
    if (postOnly) {
        opts.postOnly = postOnly;
    }

    // Send sell query
    sendQuery(this, "sell", opts, (err, response) => {
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
 * function cancelOrder(orderNumber, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.cancelOrder = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send cancelOrder query
    sendQuery(this, "cancelOrder", opts, (err, response) => {
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
 * function moveOrder(orderNumber, rate, amount, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.moveOrder = function(orderNumber, rate, amount, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber,
        "rate": rate,
        "amount": amount
    };

    // Send moveOrder query
    sendQuery(this, "moveOrder", opts, (err, response) => {
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
 * function withdraw(currency, amount, address, paymentId, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.withdraw = function(currency, amount, address, paymentId, callback) {
    // Deal with optional nature of paymentId
    if (typeof paymentId === "function") {
        callback = paymentId;
        paymentId = null;
    }

    // Build query options
    var opts = {
        "currency": currency,
        "amount": amount,
        "address": address
    };

    //only set paymentId if it is not null, otherwise Poloniex will return an error for a blank param
    if (paymentId != null) {
        opts.paymentId = paymentId;
    }

    // Send withdraw query
    sendQuery(this, "withdraw", opts, (err, response) => {
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
 * function returnFeeInfo(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnFeeInfo = function(callback) {
    // Send returnFeeInfo query
    sendQuery(this, "returnFeeInfo", null, (err, response) => {
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
 * function returnAvailableAccountBalances(account, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnAvailableAccountBalances = function(account, callback) {
    // Build query options
    var opts = {
        "account": account
    };

    // Send returnAvailableAccountBalances query
    sendQuery(this, "returnAvailableAccountBalances", opts, (err, response) => {
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
 * function returnTradableBalances(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnTradableBalances = function(callback) {
    // Send returnTradableBalances query
    sendQuery(this, "returnTradableBalances", null, (err, response) => {
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
 * function transferBalance(currency, amount, fromAccount, toAccount, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.transferBalance = function(currency, amount, fromAccount, toAccount, callback) {
    // Build query options
    var opts = {
        "currency": currency,
        "amount": amount,
        "fromAccount": fromAccount,
        "toAccount": toAccount
    };

    // Send transferBalance query
    sendQuery(this, "transferBalance", opts, (err, response) => {
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
 * function returnMarginAccountSummary(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnMarginAccountSummary = function(callback) {
    // Send returnMarginAccountSummary query
    sendQuery(this, "returnMarginAccountSummary", null, (err, response) => {
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
 * function marginBuy(currencyPair, rate, amount, lendingRate, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.marginBuy = function(currencyPair, rate, amount, lendingRate, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "lendingRate": lendingRate
    };

    // Send marginBuy query
    sendQuery(this, "marginBuy", opts, (err, response) => {
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
 * function marginSell(currencyPair, rate, amount, lendingRate, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.marginSell = function(currencyPair, rate, amount, lendingRate, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair,
        "rate": rate,
        "amount": amount,
        "lendingRate": lendingRate
    };

    // Send marginSell query
    sendQuery(this, "marginSell", opts, (err, response) => {
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
 * function getMarginPosition(currencyPair, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.getMarginPosition = function(currencyPair, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair
    };

    // Send getMarginPosition query
    sendQuery(this, "getMarginPosition", opts, (err, response) => {
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
 * function closeMarginPosition(currencyPair, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.closeMarginPosition = function(currencyPair, callback) {
    // Build query options
    var opts = {
        "currencyPair": currencyPair
    };

    // Send closeMarginPosition query
    sendQuery(this, "closeMarginPosition", opts, (err, response) => {
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
 * function createLoanOffer(currency, amount, duration, autoRenew, lendingRate, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.createLoanOffer = function(currency, amount, duration, autoRenew, lendingRate, callback) {
    // Build query options
    var opts = {
        "currency": currency,
        "amount": amount,
        "duration": duration,
        "autoRenew": autoRenew,
        "lendingRate": lendingRate
    };

    // Send createLoanOffer query
    sendQuery(this, "createLoanOffer", opts, (err, response) => {
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
 * function cancelLoanOffer(orderNumber, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.cancelLoanOffer = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send cancelLoanOffer query
    sendQuery(this, "cancelLoanOffer", opts, (err, response) => {
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
 * function returnOpenLoanOffers(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnOpenLoanOffers = function(callback) {
    // Send returnOpenLoanOffers query
    sendQuery(this, "returnOpenLoanOffers", null, (err, response) => {
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
 * function returnActiveLoans(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnActiveLoans = function(callback) {
    // Send returnActiveLoans query
    sendQuery(this, "returnActiveLoans", null, (err, response) => {
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
 * function toggleAutoRenew(orderNumber, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.toggleAutoRenew = function(orderNumber, callback) {
    // Build query options
    var opts = {
        "orderNumber": orderNumber
    };

    // Send toggleAutoRenew query
    sendQuery(this, "toggleAutoRenew", opts, (err, response) => {
        if (err) {
            // Call back with error info
            callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            callback(null, response);
        }
    });
};

module.exports = TradingWrapper;
