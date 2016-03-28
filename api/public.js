
/*
 *
 * poloniex-unofficial
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

// Representation of the Poloniex public API
var apiPublic = {};

apiPublic.foo = function() {
    // TODO: meh
    return "bar";
}

// Export a function which returns apiPublic
module.exports = () => apiPublic;

