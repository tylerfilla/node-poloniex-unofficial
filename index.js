
/*
 *
 * poloniex-unofficial
 *
 * Yet another unofficial wrapper for the Poloniex cryptocurrency exchange APIs
 * on Node.js
 *
 */

// Subunit modules for the various APIs offered by Poloniex
var apiMap = {
    "push": "./api/push.js",
    "public": "./api/public.js",
    "trading": "./api/trading.js"
};

// API selector function
exports.api = function(type) {
    // Get the module
    var mod = apiMap[type];
    
    // Abort if module isn't, well, good... (type was probably invalid)
    if (!mod) {
        return;
    }
    
    // Return API module stuff
    return require(mod)();
};

