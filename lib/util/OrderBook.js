
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

/*
 * NOTICE: This file needs documentation revisions.
 */

// Localize wrappers
var PushWrapper = module.parent.exports.PushWrapper;
var PublicWrapper = module.parent.exports.PublicWrapper;

// Do not continue without these wrappers
if (!PushWrapper || !PublicWrapper) {
    throw "Failed to localize wrappers (OrderBook.js should not be require()'d externally)";
}

/*
 * Order book utility constructor.
 */
function OrderBook(currencyPair) {
    this._currencyPair = currencyPair;

    this._wrapperPublic = null;
    this._wrapperPush = null;
}

/*
 *
 * function getWrapperPush()
 *
 * Get the push wrapper instance.
 *
 */
OrderBook.prototype.getWrapperPush = function() {
    return this._wrapperPush;
};

/*
 *
 * function setWrapperPublic(wrapperPublic)
 *
 * Set the push wrapper instance.
 *
 */
OrderBook.prototype.setWrapperPush = function(wrapperPush) {
    // Sanity check
    if (!(wrapperPush instanceof PushWrapper)) {
        throw new TypeError("wrapperPush is not an instance of PushWrapper");
    }

    this._wrapperPush = wrapperPush;
};

/*
 *
 * function getWrapperPublic()
 *
 * Get the public wrapper instance.
 *
 */
OrderBook.prototype.getWrapperPublic = function() {
    return this._wrapperPublic;
};

/*
 *
 * function setWrapperPublic(wrapperPublic)
 *
 * Set the public wrapper instance.
 *
 */
OrderBook.prototype.setWrapperPublic = function(wrapperPublic) {
    // Sanity check
    if (!(wrapperPublic instanceof PublicWrapper)) {
        throw new TypeError("wrapperPublic is not an instance of PublicWrapper");
    }

    this._wrapperPublic = wrapperPublic;
};

/*
 *
 * function getCurrencyPair(currencyPair)
 *
 * Get the target currency pair.
 *
 */
OrderBook.prototype.getCurrencyPair = function(currencyPair) {
    return this._currencyPair;
};

/*
 *
 * function setCurrencyPair(currencyPair)
 *
 * Set the target currency pair.
 *
 */
OrderBook.prototype.setCurrencyPair = function(currencyPair) {
    this._currencyPair = currencyPair;
};

/*
 *
 * function useDefaultWrappers()
 *
 * Create new push and public wrappers and use them.
 *
 */
OrderBook.prototype.useDefaultWrappers = function() {
    this.setWrapperPush(new PushWrapper());
    this.setWrapperPublic(new PublicWrapper());
};

/*
 *
 * function start()
 *
 * Start tracking the target currency pair's order book.
 *
 */
OrderBook.prototype.start = function() {
};

/*
 *
 * function start()
 *
 * Stop tracking the target currency pair's order book.
 *
 */
OrderBook.prototype.stop = function() {
};

module.exports = OrderBook;
