
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

// TODO: Write a function that executes general queries like in public.js

// TODO: Write a function that takes in API key and secret and stores them for later use

/*
 *
 * function returnBalances(callback)
 *
 * TODO: Write me
 *
 */
apiTrading.returnBalances = function(callback) {
    // TODO: Stuff goes here
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
module.exports = () => apiTrading;
