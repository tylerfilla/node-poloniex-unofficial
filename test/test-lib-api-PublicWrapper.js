
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

/*global assert describe it beforeEach*/

"use strict";

// Import main module
const polo = require("./../");

// Delay between online tests
const DELAY_ONLINE_TESTS = 500;

// Get PublicWrapper class
const PublicWrapper = polo.PublicWrapper;

// Create new public wrapper instance
const poloPublic = new PublicWrapper();

describe("PublicWrapper", function() {
    it("should be a function", function(done) {
        assert(typeof PublicWrapper === "function");
        done();
    });
    it("should implement Poloniex's returnTicker command", function(done) {
        assert(typeof poloPublic.returnTicker !== "undefined");
        done();
    });
    it("should implement Poloniex's return24hVolume command", function(done) {
        assert(typeof poloPublic.return24hVolume !== "undefined");
        done();
    });
    it("should implement Poloniex's returnOrderBook command", function(done) {
        assert(typeof poloPublic.returnOrderBook !== "undefined");
        done();
    });
    it("should implement Poloniex's returnTradeHistory command", function(done) {
        assert(typeof poloPublic.returnTradeHistory !== "undefined");
        done();
    });
    it("should implement Poloniex's returnChartData command", function(done) {
        assert(typeof poloPublic.returnChartData !== "undefined");
        done();
    });
    it("should implement Poloniex's returnCurrencies command", function(done) {
        assert(typeof poloPublic.returnCurrencies !== "undefined");
        done();
    });
    it("should implement Poloniex's returnLoanOrders command", function(done) {
        assert(typeof poloPublic.returnLoanOrders !== "undefined");
        done();
    });
    describe(`online (involves Poloniex servers with ${DELAY_ONLINE_TESTS}ms delays)`, function() {
        // Redefine "slow" for Internet communication
        this.slow(500);

        // General checks for any public API response
        function checkGeneral(res) {
            assert(typeof res !== "undefined");
            assert(typeof res.error === "undefined");
            return res;
        }

        // Specific checks for any one response (may be redefined)
        let checkSpecific = function(res) {
            return res;
        };

        // General function for promise testing
        function testPromise(res) {
            return checkGeneral(res) && checkSpecific(res);
        }

        // General function for callback testing
        function testCallback(done) {
            return function(err, res) {
                if (err) {
                    throw err;
                }
                checkGeneral(res);
                checkSpecific(res);
                done();
            };
        }

        // Apply a delay before each test (to avoid overtaxing Poloniex servers)
        beforeEach(function(done) {
            setTimeout(done, DELAY_ONLINE_TESTS);
        });

        describe("returnTicker", function() {
            it("should return ticker for all markets (via promise)", function() {
                return poloPublic.returnTicker().then(testPromise);
            });
            it("should return ticker for all markets (via callback)", function(done) {
                poloPublic.returnTicker(testCallback(done));
            });
        });
        describe("return24hVolume", function() {
            it("should return 24-hour volume for all markets (via promise)", function() {
                return poloPublic.return24hVolume().then(testPromise);
            });
            it("should return 24-hour volume for all markets (via callback)", function(done) {
                poloPublic.return24hVolume(testCallback(done));
            });
        });
        describe("returnOrderBook", function() {
        });
        describe("returnTradeHistory", function() {
        });
        describe("returnChartData", function() {
        });
        describe("returnCurrencies", function() {
            it("should return all currencies (via promise)", function() {
                return poloPublic.returnCurrencies().then(testPromise);
            });
            it("should return all currencies (via callback)", function(done) {
                poloPublic.return24hVolume(testCallback(done));
            });
        });
        describe("returnLoanOrders", function() {
        });
    });
});
