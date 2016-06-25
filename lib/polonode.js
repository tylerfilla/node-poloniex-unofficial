
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
 * Module IDs for API wrappers.
 */
const MOD_ID_WRAPPER_PUSH = "./api/push.js";
const MOD_ID_WRAPPER_PUBLIC = "./api/public.js";
const MOD_ID_WRAPPER_TRADING = "./api/trading.js";

/*
 * Legacy API selector function. Deprecated.
 */
exports.api = function(name, params) {
    // Module ID
    var modId;

    // Get module ID from wrapper name
    switch (name) {
    case "push":
        modId = MOD_ID_WRAPPER_PUSH;
        break;
    case "public":
        modId = MOD_ID_WRAPPER_PUBLIC;
        break;
    case "trading":
        modId = MOD_ID_WRAPPER_TRADING;
        break;
    }

    // Abort if module isn't available
    if (!modId) {
        return;
    }

    // Get the API wrapper constructor
    var wrapper = require(modId);

    // If params were supplied
    if (params) {
        // Instantiate wrapper with authentication parameters
        return new wrapper(params.key, params.secret);
    } else {
        // Instantiate wrapper without authentication parameters
        return new wrapper();
    }
};

/*
 * Push API wrapper constructor.
 */
exports.PushWrapper = require(MOD_ID_WRAPPER_PUSH);

/*
 * Public API wrapper constructor.
 */
exports.PublicWrapper = require(MOD_ID_WRAPPER_PUBLIC);

/*
 * Trading API wrapper constructor.
 */
exports.TradingWrapper = require(MOD_ID_WRAPPER_TRADING);
