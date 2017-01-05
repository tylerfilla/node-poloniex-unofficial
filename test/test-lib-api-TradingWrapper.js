
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
const config = require("./config.js");

// Delay between online tests
const DELAY_ONLINE_TESTS = 500;

// Get TradingWrapper class
const TradingWrapper = polo.TradingWrapper;

// Create new trading wrapper instance
const poloTrading = new TradingWrapper(config.key, config.secret);

describe("TradingWrapper", function() {
    it("should be a function", function(done) {
        assert(typeof TradingWrapper === "function");
        done();
    });
    it("should implement Poloniex's returnCompleteBalances command", function(done) {
        assert(typeof poloTrading.returnCompleteBalances !== "undefined");
        done();
    });
    describe(`online (${DELAY_ONLINE_TESTS}ms delays)`, function() {
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

        describe("returnCompleteBalances", function() {
            it("should return complete balances for user (via promise)", function() {
                return poloTrading.returnCompleteBalances().then(testPromise);
            });
            it("should return complete balances for user (via callback)", function(done) {
                poloTrading.returnCompleteBalances(testCallback(done));
            });
        });
    });
});
