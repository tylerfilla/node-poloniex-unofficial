
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
const hyperquest = require("hyperquest");
const hypersponse = require("hypersponse");
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
function TradingWrapper(apiKeyOrParams, apiSecret, nonceGen) {
    // Assume first parameter (i.e. apiKeyOrParams) is a params package
    let params = apiKeyOrParams;

    // Try to prove this assumption wrong
    if (params === null || typeof params !== "object") {
        // Pack parameters if so
        params = {
            apiKey: apiKeyOrParams,
            apiSecret: apiSecret,
            nonceGen: nonceGen
        };
    }

    // Assert parameter expectations
    ParamUtils.expectParams(params, {
        apiKey: "string",
        apiSecret: "string",
        nonceGen: {type: "function", opt: true}
    });

    this._apiKey = params.apiKey;
    this._apiSecret = params.apiSecret;
    this._nonceGen = params.nonceGen;
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

    // Add nonce to query
    if (!query.nonce) {
        // Get nonce from user-supplied function if available, but fall back to Date.now
        query["nonce"] = (api._nonceGen || Date.now)();
    }

    // A bit hacky, but it won't break any time soon
    let queryString = url.format({"query": query}).substring(1);

    // Build options for request
    let opts = {
        "uri": POLONIEX_TRADING_URL,
        "method": "POST",
        "headers": {
            "User-Agent": REQUEST_USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
            "Key": api._apiKey,
            "Sign": crypto.createHmac("sha512", api._apiSecret).update(queryString).digest("hex")
        },
        "body": queryString
    };

    // Return a promise for the response data
    return new Promise((resolve, reject) => {
        // Send request to Poloniex
        hypersponse(hyperquest(opts), (error, response, body) => {
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

    // Send returnBalances query and get promise for its response
    let promise = sendQuery(this, "returnBalances", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnCompleteBalances query and get promise for its response
    let promise = sendQuery(this, "returnCompleteBalances", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnDepositAddresses query and get promise for its response
    let promise = sendQuery(this, "returnDepositAddresses", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send generateNewAddress query and get promise for its response
    let promise = sendQuery(this, "generateNewAddress", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnDepositsWithdrawals query and get promise for its response
    let promise = sendQuery(this, "returnDepositsWithdrawals", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnOpenOrders query and get promise for its response
    let promise = sendQuery(this, "returnOpenOrders", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnTradeHistory query and get promise for its response
    let promise = sendQuery(this, "returnTradeHistory", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnOrderTrades query and get promise for its response
    let promise = sendQuery(this, "returnOrderTrades", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send buy query and get promise for its response
    let promise = sendQuery(this, "buy", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send sell query and get promise for its response
    let promise = sendQuery(this, "sell", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send cancelOrder query and get promise for its response
    let promise = sendQuery(this, "cancelOrder", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send moveOrder query and get promise for its response
    let promise = sendQuery(this, "moveOrder", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send withdraw query and get promise for its response
    let promise = sendQuery(this, "withdraw", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnFeeInfo query and get promise for its response
    let promise = sendQuery(this, "returnFeeInfo", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnAvailableAccountBalances query and get promise for its response
    let promise = sendQuery(this, "returnAvailableAccountBalances", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnTradableBalances query and get promise for its response
    let promise = sendQuery(this, "returnTradableBalances", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send transferBalance query and get promise for its response
    let promise = sendQuery(this, "transferBalance", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnMarginAccountSummary query and get promise for its response
    let promise = sendQuery(this, "returnMarginAccountSummary", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send marginBuy query and get promise for its response
    let promise = sendQuery(this, "marginBuy", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send marginSell query and get promise for its response
    let promise = sendQuery(this, "marginSell", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send getMarginPosition query and get promise for its response
    let promise = sendQuery(this, "getMarginPosition", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send closeMarginPosition query and get promise for its response
    let promise = sendQuery(this, "closeMarginPosition", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send createLoanOffer query and get promise for its response
    let promise = sendQuery(this, "createLoanOffer", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send cancelLoanOffer query and get promise for its response
    let promise = sendQuery(this, "cancelLoanOffer", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnOpenLoanOffers query and get promise for its response
    let promise = sendQuery(this, "returnOpenLoanOffers", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send returnActiveLoans query and get promise for its response
    let promise = sendQuery(this, "returnActiveLoans", null);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
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

    // Send toggleAutoRenew query and get promise for its response
    let promise = sendQuery(this, "toggleAutoRenew", opts);

    // Connect callback to promise, if necessary
    if (typeof params.callback !== "undefined") {
        promise.then(res => setImmediate(() => params.callback(null, res)));
        promise.catch(err => setImmediate(() => params.callback(err, null)));
    }

    // Return promise for response
    return promise;
};

module.exports = TradingWrapper;
