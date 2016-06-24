
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
 * Representation of a key-secret pair for authentication.
 */
var Auth = function(key, secret) {
    this.key = key;
    this.secret = secret;
}

module.exports = Auth;
