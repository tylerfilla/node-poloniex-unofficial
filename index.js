
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

// Subunit modules for the various APIs offered by Poloniex
var API_MODULE_MAP = {
    "push": "./api/push.js",
    "public": "./api/public.js",
    "trading": "./api/trading.js"
};

// API selector function
exports.api = function(name, params) {
    // Get the module
    var mod = API_MODULE_MAP[name];
    
    // Abort if module isn't, well, good... (type was probably invalid)
    if (!mod) {
        return;
    }
    
    // Return API module stuff
    return require(mod)(params);
};
