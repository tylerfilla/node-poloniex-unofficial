
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
    this._pairString = base + "_" + quote;
}

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
 * function getPairString()
 *
 * Get the currencies of this currency pair as a Poloniex pair string (e.g.
 * "BTC_ETH")
 *
 */
CurrencyPair.prototype.getPairString = function() {
    return this._base + "_" + this._quote;
};
