
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

/*global describe it*/

"use strict";

// Import third-party modules
const assert = require("assert");

// Import main module
const polo = require("./../");

// Get CurrencyPair class
const CurrencyPair = polo.CurrencyPair;

// Simplify JSON stringification
const json = JSON.stringify;

describe("CurrencyPair", function() {
    it("should be a function", done => {
        assert(typeof CurrencyPair !== "undefined");
        done();
    });
    it("should return base currency correctly", done => {
        let base = "USDT";
        let quote = "BTC";
        let pair = new CurrencyPair(base, quote);
        assert(pair.getBase() === base, `"${pair.getBase()}" != "${base}"`);
        done();
    });
    it("should return quote currency correctly", done => {
        let base = "USDT";
        let quote = "BTC";
        let pair = new CurrencyPair(base, quote);
        assert(pair.getQuote() === quote, `"${pair.getQuote()}" != "${quote}"`);
        done();
    });
    it("should mutually accept equal objects in equals()", done => {
        let base = "USDT";
        let quote = "BTC";
        let pair1 = new CurrencyPair(base, quote);
        let pair2 = new CurrencyPair(base, quote);
        // Succeed if and only if both pairs accept equivalence
        assert(pair1.equals(pair2) && pair2.equals(pair1), `${json(pair1)} != ${json(pair2)}`);
        done();
    });
    it("should mutually reject non-equal objects in equals()", done => {
        let base1 = "USDT";
        let quote1 = "BTC";
        let base2 = "BTC";
        let quote2 = "XMR";
        let pair1 = new CurrencyPair(base1, quote1);
        let pair2 = new CurrencyPair(base2, quote2);
        // Succeed if and only if either bases or quotes are different and both pairs reject equivalence
        assert((base1 !== base2 || quote1 !== quote2) && !pair1.equals(pair2) && !pair2.equals(pair1), `${json(pair1)} == ${json(pair2)}`);
        assert(!pair1.equals("dog"), "hopefully things never get this bad");
        done();
    });
    it("should provide string->pair->string equivalence", done => {
        let pairStr = "USDT_BTC";
        let pair = CurrencyPair.fromString(pairStr);
        let pairStrNew = pair.toString();
        assert(pairStrNew === pairStr, `"${pairStr}" -> ${json(pair)} -> "${pairStrNew}"`);
        done();
    });
    it("should provide pair->string->pair equivalence", done => {
        let pair = new CurrencyPair("USDT", "BTC");
        let pairStr = pair.toString();
        let pairNew = CurrencyPair.fromString(pairStr);
        assert(pair.equals(pairNew), `${json(pair)} -> "${pairStr}" -> ${json(pairNew)}`);
        done();
    });
});
