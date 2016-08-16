
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

    // Return a promise for the response data
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
    return sendQuery(this, "returnBalances", null).then(res => {
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
    return sendQuery(this, "returnCompleteBalances", opts).then(res => {
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
    return sendQuery(this, "returnDepositAddresses", null).then(res => {
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
    return sendQuery(this, "generateNewAddress", opts).then(res => {
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
    return sendQuery(this, "returnDepositsWithdrawals", opts).then(res => {
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
    return sendQuery(this, "returnOpenOrders", opts).then(res => {
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
    return sendQuery(this, "returnOrderTrades", opts).then(res => {
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
    return sendQuery(this, "buy", opts).then(res => {
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
    return sendQuery(this, "sell", opts).then(res => {
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
    return sendQuery(this, "cancelOrder", opts).then(res => {
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
    return sendQuery(this, "moveOrder", opts).then(res => {
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
    return sendQuery(this, "withdraw", opts).then(res => {
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
    return sendQuery(this, "returnFeeInfo", null).then(res => {
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
    return sendQuery(this, "returnAvailableAccountBalances", opts).then(res => {
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
    return sendQuery(this, "returnTradableBalances", null).then(res => {
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
    return sendQuery(this, "transferBalance", opts).then(res => {
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
    return sendQuery(this, "returnMarginAccountSummary", null).then(res => {
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
    return sendQuery(this, "marginBuy", opts).then(res => {
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
    return sendQuery(this, "marginSell", opts).then(res => {
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
    return sendQuery(this, "getMarginPosition", opts).then(res => {
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
    return sendQuery(this, "closeMarginPosition", opts).then(res => {
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
    return sendQuery(this, "createLoanOffer", opts).then(res => {
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
    return sendQuery(this, "cancelLoanOffer", opts).then(res => {
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
    return sendQuery(this, "returnOpenLoanOffers", null).then(res => {
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
    return sendQuery(this, "returnActiveLoans", null).then(res => {
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
    return sendQuery(this, "toggleAutoRenew", opts).then(res => {
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

module.exports = TradingWrapper;
