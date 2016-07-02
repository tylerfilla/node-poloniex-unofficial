
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
 * Trading pair utility constructor.
 */
function TradingPair(baseOrPairString, quote) {
    this._base = null;
    this._quote = null;

    if (typeof quote !== "undefined") {
        this._base = baseOrPairString;
        this._quote = quote;
    } else {
        this.setPairString(baseOrPairString);
    }
}

/*
 *
 * function getBase()
 *
 * Get the base currency of this trading pair.
 *
 */
TradingPair.prototype.getBase = function() {
    return this._base;
};

/*
 *
 * function setBase(base)
 *
 * Set the base currency of this trading pair.
 *
 */
TradingPair.prototype.setBase = function(base) {
    this._base = base;
};

/*
 *
 * function getQuote()
 *
 * Get the quote currency of this trading pair.
 *
 */
TradingPair.prototype.getQuote = function() {
    return this._quote;
};

/*
 *
 * function setQuote(quote)
 *
 * Set the quote currency of this trading pair.
 *
 */
TradingPair.prototype.setQuote = function(quote) {
    this._quote = quote;
};

/*
 *
 * function swap()
 *
 * Swap the base and quote currencies of this trading pair.
 *
 */
TradingPair.prototype.swap = function() {
    // Localize currencies
    var base = this._base;
    var quote = this._quote;

    // Swap currencies
    this._base = quote;
    this._quote = base;
};

/*
 *
 * function getPairString()
 *
 * Get the currencies of this trading pair as a Poloniex pair string (e.g.
 * "BTC_ETH")
 *
 */
TradingPair.prototype.getPairString = function() {
    return this._base + "_" + this._quote;
};

/*
 *
 * function setPairString(pairString)
 *
 * Set the currencies of this trading pair as a Poloniex pair string (e.g.
 * "BTC_ETH")
 *
 */
TradingPair.prototype.setPairString = function(pairString) {
    // Validate pair string
    if (!pairString || pairString.length < 3 || pairString.indexOf("_") == -1) {
        throw "Invalid Poloniex pair string";
    }

    // Split the pair string
    var pairStringSplit = pairString.split("_", 1);

    // Extract components of pair string
    this._base = pairStringSplit[0];
    this._quote = pairStringSplit[1];
};
