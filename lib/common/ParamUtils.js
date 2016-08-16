
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

// Parameter utilities
const ParamUtils = {};

/*
 *
 * function loadCallback(params, callback, setFunc)
 *
 * Enforces correct order of parameters in a function that accepts two: a set of
 * packed parameters and a callback function. The presence of a parameters
 * package will be enforced and the callback will be loaded into it. An outward
 * set function constructed like so is required to modify the calling function's
 * parameters: function() { return packedParamsObj = {}; }
 *
 */
ParamUtils.loadCallback = function(params, callback, setFunc) {
    // If callback is in place of params
    if (typeof params === "function" && typeof callback === "undefined") {
        // Move callback to appropriate place
        callback = params;
    }

    // If params is improperly typed
    if (typeof params !== "object" || params === null) {
        // Set params to a blank object (use a function to notify the caller)
        params = setFunc();
    }

    // Set callback as a parameter if it is not already
    if (typeof params.callback === "undefined") {
        params.callback = callback;
    }
};

/*
 *
 * function expectParams(params, expects)
 *
 * Asserts that a given set of packed parameters follows a given set of type
 * and presence expectations. Throws a detailed error message if otherwise.
 *
 */
ParamUtils.expectParams = function(params, expects) {
    // If parameters are invalidly typed
    if (params === null || typeof params !== "object") {
        throw "Invalid parameters (as of version 2.0.0, this library expects packed parameters)";
    }

    // A list of all unmet expectations
    let unmet = [];

    // Iterate over expectations
    for (let paramName in expects) {
        // Get expectation
        let expect = expects[paramName];
        let expectOptional = false;

        // Handle full expectations
        if (typeof expect === "object" && expect.type) {
            let temp = expect;
            expect = temp.type;
            expectOptional = temp.opt || false;
        }

        // Handle simple string type expectations
        if (typeof expect === "string") {
            // Wrap in array
            expect = [expect];
        }

        // Expectation must now be in array form
        if (!(typeof expect === "object" && expect instanceof Array)) {
            throw `Invalid expectation: unable to enforce ${typeof expect}`;
        }

        // Get parameter and its type
        let param = params[paramName];
        let paramType = typeof param;

        // If parameter is omitted, but optional, skip it
        if (paramType === "undefined" && expectOptional) {
            continue;
        }

        // Flag indicating match success
        let match = false;

        // Try to match expectation based on its type
        for (let expectType of expect) {
            if (typeof expectType === "string") {
                if (paramType === expectType) {
                    match = true;
                }
            } else if (typeof expectType === "function") {
                if (param instanceof expectType) {
                    match = true;
                }
            }

            // Succeed on first match, no need to continue
            if (match) {
                break;
            }
        }

        // If types did not match, record an appropriate error message
        if (!match) {
            let expectString = expect.join(" OR ");
            if (paramType === "undefined") {
                unmet.push(`Expected parameter \"${paramName}\" of type ${expectString}`);
            } else {
                unmet.push(`Expected${expectOptional ? " optional" : ""} parameter \"${paramName}\" of type ${expectString}, but got ${paramType}`);
            }
        }
    }

    // If problems were encountered, fail with compiled error message
    if (unmet.length > 0) {
        throw unmet.join("\n");
    }
};

module.exports = ParamUtils;
