
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
 * Currency pair utility constructor.
 */
function CurrencyPair(base, quote) {
    this._base = base;
    this._quote = quote;
}

/*
 *
 * function fromString(str) [static]
 *
 * Create a new instance from the given string representation.
 *
 */
CurrencyPair.fromString = function(str) {
    if (!str || str.length < 3 || str.indexOf("_") == -1) {
        throw "Invalid currency pair string";
    }

    // Split the string
    var split = str.split("_");

    // Extract base and quote currencies
    var base = split[0];
    var quote = split[1];

    // Create a new instance
    return new CurrencyPair(base, quote);
};

/*
 *
 * function getBase()
 *
 * Get the base currency of this currency pair.
 *
 */
CurrencyPair.prototype.getBase = function() {
    return this._base;
};

/*
 *
 * function getQuote()
 *
 * Get the quote currency of this currency pair.
 *
 */
CurrencyPair.prototype.getQuote = function() {
    return this._quote;
};

/*
 *
 * function toString()
 *
 * Get a string representation of this currency pair (e.g. "BTC_ETH").
 *
 */
CurrencyPair.prototype.toString = function() {
    return this._base + "_" + this._quote;
};

/*
 *
 * function equals(obj)
 *
 * Compares this currency pair to another object.
 *
 */
CurrencyPair.prototype.equals = function(obj) {
    if (obj instanceof CurrencyPair) {
        return this._base === obj._base && this._quote === obj._quote;
    }

    return false;
};

module.exports = CurrencyPair;
