
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
const crypto = require("crypto");
const request = require("request");
const url = require("url");

// Import local modules
const CurrencyPair = require("./../util/CurrencyPair.js");
const ParamUtils = require("./../common/ParamUtils.js");

// Poloniex trading API URL
const POLONIEX_TRADING_URL = "https://poloniex.com/tradingApi";

// User-Agent for HTTP requests
const REQUEST_USER_AGENT = "node-poloniex-unofficial|TradingWrapper.js (+https://git.io/polonode)";

/*
 * Trading API wrapper constructor.
 */
function TradingWrapper(apiKey, apiSecret, nonceGen) {
    this._apiKey = apiKey;
    this._apiSecret = apiSecret;
    this._nonceGen = nonceGen;
}

/*
 *
 * function sendQuery(api, command, params, callback)
 *
 */
function sendQuery(api, command, params, callback) {
    // Check for auth info
    if (!api._apiKey || !api._apiSecret) {
        // Call back with error
        callback({"msg": "Auth info not set"}, null);

        // We're done here
        return;
    }

    // Create query with given parameters, if applicable
    let query = params || {};

    // Add command to query
    if (!query.command) {
        query["command"] = command;
    }

    // Add nonce to query
    if (!query.nonce) {
        // Get nonce from user-supplied function if available, but fall back to Date.now
        query["nonce"] = (api._nonceGen || Date.now)();
    }

    // A bit hacky, but it won't break any time soon
    let queryString = url.format({"query": query}).substring(1);

    // Build options for request
    let opts = {
        "url": POLONIEX_TRADING_URL,
        "method": "POST",
        "headers": {
            "User-Agent": REQUEST_USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
            "Key": api._apiKey,
            "Sign": crypto.createHmac("sha512", api._apiSecret).update(queryString).digest("hex")
        },
        "body": queryString
    };

    // Send request to Poloniex
    request(opts, (error, response, body) => {
        if (!error && response && response.statusCode == 200) {
            // Parse body as JSON
            let bodyObj = JSON.parse(body);

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
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnBalances query
    sendQuery(this, "returnBalances", null, (err, response) => {
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
 * function returnCompleteBalances(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnCompleteBalances = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        account: {type: "string", opt: true}
    });

    // Include required parameters
    let opts = {};

    // Include optional param "account"
    if (typeof params.account !== "undefined") {
        opts.account = params.account;
    }

    // Send returnCompleteBalances query
    sendQuery(this, "returnCompleteBalances", opts, (err, response) => {
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
 * function returnDepositAddresses(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnDepositAddresses = function(callback) {
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnDepositAddresses query
    sendQuery(this, "returnDepositAddresses", null, (err, response) => {
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
 * function generateNewAddress(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.generateNewAddress = function(params, callback) {
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

    // Send generateNewAddress query
    sendQuery(this, "generateNewAddress", opts, (err, response) => {
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
 * function returnDepositsWithdrawals(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnDepositsWithdrawals = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        start: ["number", "string"],
        end: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        start: params.start,
        end: params.end
    };

    // Send returnDepositsWithdrawals query
    sendQuery(this, "returnDepositsWithdrawals", opts, (err, response) => {
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
 * function returnOpenOrders(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnOpenOrders = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair]
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair
    };

    // Send returnOpenOrders query
    sendQuery(this, "returnOpenOrders", opts, (err, response) => {
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
TradingWrapper.prototype.returnTradeHistory = function(params, callback) {
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
 * function returnOrderTrades(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnOrderTrades = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        orderNumber: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        orderNumber: params.orderNumber
    };

    // Send returnOrderTrades query
    sendQuery(this, "returnOrderTrades", opts, (err, response) => {
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
 * function buy(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.buy = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        rate: ["number", "string"],
        amount: ["number", "string"],
        fillOrKill: {type: ["boolean", "number", "string"], opt: true},
        immediateOrCancel: {type: ["boolean", "number", "string"], opt: true},
        postOnly: {type: ["boolean", "number", "string"], opt: true}
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Interpret boolean parameter "fillOrKill"
    if (typeof params.fillOrKill === "boolean") {
        params.fillOrKill = params.fillOrKill ? "1" : "0";
    }

    // Interpret boolean parameter "immediateOrCancel"
    if (typeof params.immediateOrCancel === "boolean") {
        params.immediateOrCancel = params.immediateOrCancel ? "1" : "0";
    }

    // Interpret boolean parameter "postOnly"
    if (typeof params.postOnly === "boolean") {
        params.postOnly = params.postOnly ? "1" : "0";
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        rate: params.rate,
        amount: params.amount
    };

    // Include optional parameter "fillOrKill"
    if (typeof params.fillOrKill !== "undefined") {
        opts.fillOrKill = params.fillOrKill;
    }

    // Include optional parameter "immediateOrCancel"
    if (typeof params.immediateOrCancel !== "undefined") {
        opts.immediateOrCancel = params.immediateOrCancel;
    }

    // Include optional parameter "postOnly"
    if (typeof params.postOnly !== "undefined") {
        opts.postOnly = params.postOnly;
    }

    // Send buy query
    sendQuery(this, "buy", opts, (err, response) => {
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
 * function sell(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.sell = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        rate: ["number", "string"],
        amount: ["number", "string"],
        fillOrKill: {type: ["boolean", "number", "string"], opt: true},
        immediateOrCancel: {type: ["boolean", "number", "string"], opt: true},
        postOnly: {type: ["boolean", "number", "string"], opt: true}
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Interpret boolean parameter "fillOrKill"
    if (typeof params.fillOrKill === "boolean") {
        params.fillOrKill = params.fillOrKill ? "1" : "0";
    }

    // Interpret boolean parameter "immediateOrCancel"
    if (typeof params.immediateOrCancel === "boolean") {
        params.immediateOrCancel = params.immediateOrCancel ? "1" : "0";
    }

    // Interpret boolean parameter "postOnly"
    if (typeof params.postOnly === "boolean") {
        params.postOnly = params.postOnly ? "1" : "0";
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        rate: params.rate,
        amount: params.amount
    };

    // Include optional parameter "fillOrKill"
    if (typeof params.fillOrKill !== "undefined") {
        opts.fillOrKill = params.fillOrKill;
    }

    // Include optional parameter "immediateOrCancel"
    if (typeof params.immediateOrCancel !== "undefined") {
        opts.immediateOrCancel = params.immediateOrCancel;
    }

    // Include optional parameter "postOnly"
    if (typeof params.postOnly !== "undefined") {
        opts.postOnly = params.postOnly;
    }

    // Send sell query
    sendQuery(this, "sell", opts, (err, response) => {
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
 * function cancelOrder(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.cancelOrder = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        orderNumber: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        orderNumber: params.orderNumber
    };

    // Send cancelOrder query
    sendQuery(this, "cancelOrder", opts, (err, response) => {
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
 * function moveOrder(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.moveOrder = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        orderNumber: ["number", "string"],
        rate: ["number", "string"],
        amount: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        orderNumber: params.orderNumber,
        rate: params.rate,
        amount: params.amount
    };

    // Send moveOrder query
    sendQuery(this, "moveOrder", opts, (err, response) => {
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
 * function withdraw(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.withdraw = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currency: "string",
        amount: ["number", "string"],
        address: "string",
        paymentId: {type: "string", opt: true}
    });

    // Include required parameters
    let opts = {
        currency: params.currency,
        amount: params.amount,
        address: params.address
    };

    // Include optional parameter "paymentId"
    if (typeof params.paymentId !== "undefined") {
        opts.paymentId = params.paymentId;
    }

    // Send withdraw query
    sendQuery(this, "withdraw", opts, (err, response) => {
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
 * function returnFeeInfo(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnFeeInfo = function(callback) {
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnFeeInfo query
    sendQuery(this, "returnFeeInfo", null, (err, response) => {
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
 * function returnAvailableAccountBalances(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnAvailableAccountBalances = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        account: "string"
    });

    // Include required parameters
    let opts = {
        account: params.account
    };

    // Send returnAvailableAccountBalances query
    sendQuery(this, "returnAvailableAccountBalances", opts, (err, response) => {
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
 * function returnTradableBalances(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnTradableBalances = function(callback) {
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnTradableBalances query
    sendQuery(this, "returnTradableBalances", null, (err, response) => {
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
 * function transferBalance(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.transferBalance = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currency: "string",
        amount: ["number", "string"],
        fromAccount: "string",
        toAccount: "string"
    });

    // Include required parameters
    let opts = {
        currency: params.currency,
        amount: params.amount,
        fromAccount: params.fromAccount,
        toAccount: params.toAccount
    };

    // Send transferBalance query
    sendQuery(this, "transferBalance", opts, (err, response) => {
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
 * function returnMarginAccountSummary(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnMarginAccountSummary = function(callback) {
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnMarginAccountSummary query
    sendQuery(this, "returnMarginAccountSummary", null, (err, response) => {
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
 * function marginBuy(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.marginBuy = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        rate: ["number", "string"],
        amount: ["number", "string"],
        lendingRate: {type: ["number", "string"], opt: true}
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        rate: params.rate,
        amount: params.amount
    };

    // Include optional parameter "lendingRate"
    if (typeof params.lendingRate !== "undefined") {
        opts.lendingRate = params.lendingRate;
    }

    // Send marginBuy query
    sendQuery(this, "marginBuy", opts, (err, response) => {
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
 * function marginSell(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.marginSell = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair],
        rate: ["number", "string"],
        amount: ["number", "string"],
        lendingRate: {type: ["number", "string"], opt: true}
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair,
        rate: params.rate,
        amount: params.amount
    };

    // Include optional parameter "lendingRate"
    if (typeof params.lendingRate !== "undefined") {
        opts.lendingRate = params.lendingRate;
    }

    // Send marginSell query
    sendQuery(this, "marginSell", opts, (err, response) => {
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
 * function getMarginPosition(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.getMarginPosition = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair]
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair
    };

    // Send getMarginPosition query
    sendQuery(this, "getMarginPosition", opts, (err, response) => {
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
 * function closeMarginPosition(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.closeMarginPosition = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currencyPair: ["string", CurrencyPair]
    });

    // Stringify currency pair if necessary
    if (params.currencyPair instanceof CurrencyPair) {
        params.currencyPair = params.currencyPair.toString();
    }

    // Include required parameters
    let opts = {
        currencyPair: params.currencyPair
    };

    // Send closeMarginPosition query
    sendQuery(this, "closeMarginPosition", opts, (err, response) => {
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
 * function createLoanOffer(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.createLoanOffer = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        currency: "string",
        amount: ["number", "string"],
        duration: ["number", "string"],
        autoRenew: ["boolean", "number", "string"],
        lendingRate: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        currency: params.currency,
        amount: params.amount,
        duration: params.duration,
        autoRenew: params.autoRenew,
        lendingRate: params.lendingRate
    };

    // Send createLoanOffer query
    sendQuery(this, "createLoanOffer", opts, (err, response) => {
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
 * function cancelLoanOffer(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.cancelLoanOffer = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        orderNumber: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        orderNumber: params.orderNumber
    };

    // Send cancelLoanOffer query
    sendQuery(this, "cancelLoanOffer", opts, (err, response) => {
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
 * function returnOpenLoanOffers(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnOpenLoanOffers = function(callback) {
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnOpenLoanOffers query
    sendQuery(this, "returnOpenLoanOffers", null, (err, response) => {
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
 * function returnActiveLoans(callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.returnActiveLoans = function(callback) {
    // No extra parameters are necessary yet
    let params = {};

    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Send returnActiveLoans query
    sendQuery(this, "returnActiveLoans", null, (err, response) => {
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
 * function toggleAutoRenew(params, callback)
 *
 * See the official Poloniex docs for usage.
 *
 */
TradingWrapper.prototype.toggleAutoRenew = function(params, callback) {
    // Load callback into params, if necessary
    ParamUtils.loadCallback(params, callback, () => params = {});

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        orderNumber: ["number", "string"]
    });

    // Include required parameters
    let opts = {
        orderNumber: params.orderNumber
    };

    // Send toggleAutoRenew query
    sendQuery(this, "toggleAutoRenew", opts, (err, response) => {
        if (err) {
            // Call back with error info
            params.callback({"msg": err.msg}, null);
        } else {
            // Call back with response
            params.callback(null, response);
        }
    });
};

module.exports = TradingWrapper;
