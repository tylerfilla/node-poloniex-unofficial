
/*
 *
 * poloniex-unofficial
 *
 * Yet another unofficial wrapper for the Poloniex cryptocurrency exchange APIs
 * on Node.js
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

