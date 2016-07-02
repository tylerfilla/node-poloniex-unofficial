
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
<<<<<<< ab1f12827d8345a458252f6419eb6ae7981cfb28
<<<<<<< 2658eafd0eaf693e397f386925d0f10016f9a0a6
=======
    this._pairString = base + "_" + quote;
>>>>>>> Renamed TradingPair.js to CurrencyPair.js and made immutable
=======
>>>>>>> Add static constructor for Poloniex currency pair strings
}

/*
 *
<<<<<<< ab1f12827d8345a458252f6419eb6ae7981cfb28
<<<<<<< 2658eafd0eaf693e397f386925d0f10016f9a0a6
=======
>>>>>>> Add static constructor for Poloniex currency pair strings
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
<<<<<<< ab1f12827d8345a458252f6419eb6ae7981cfb28
=======
>>>>>>> Renamed TradingPair.js to CurrencyPair.js and made immutable
=======
>>>>>>> Add static constructor for Poloniex currency pair strings
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
<<<<<<< ab1f12827d8345a458252f6419eb6ae7981cfb28
<<<<<<< 2658eafd0eaf693e397f386925d0f10016f9a0a6
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
=======
 * function getPairString()
=======
 * function toString()
>>>>>>> Add static constructor for Poloniex currency pair strings
 *
 * Get a string representation of this currency pair (e.g. "BTC_ETH").
 *
 */
CurrencyPair.prototype.toString = function() {
    return this._base + "_" + this._quote;
};
<<<<<<< ab1f12827d8345a458252f6419eb6ae7981cfb28
>>>>>>> Renamed TradingPair.js to CurrencyPair.js and made immutable
=======

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
>>>>>>> Add static constructor for Poloniex currency pair strings
