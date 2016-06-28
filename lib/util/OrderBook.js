
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
 * NOTICE: This file needs documentation revisions.
 */

// Localize wrappers
var PushWrapper = module.parent.exports.PushWrapper;
var PublicWrapper = module.parent.exports.PublicWrapper;

// Do not continue without these wrappers
if (!PushWrapper || !PublicWrapper) {
    throw "Failed to localize wrappers (OrderBook.js should not be require()'d externally)";
}

/*
 * Order book utility constructor.
 */
function OrderBook(currencyPair) {
    this._currencyPair = currencyPair;

    this._wrapperPush = null;
    this._wrapperPublic = null;

    this._running = false;

    this._callbackSetStart = new Array();
    this._callbackSetStop = new Array();
    this._callbackSetSync = new Array();
    this._callbackSetLoseSync = new Array();
}

/*
 *
 * function getWrapperPush()
 *
 * Get the push wrapper instance.
 *
 */
OrderBook.prototype.getWrapperPush = function() {
    return this._wrapperPush;
};

/*
 *
 * function setWrapperPush(wrapperPush)
 *
 * Set the push wrapper instance.
 *
 */
OrderBook.prototype.setWrapperPush = function(wrapperPush) {
    // Lock while running
    if (this._running) {
        throw "Push wrapper instance cannot be changed while running";
    }

    // Sanity check
    if (!(wrapperPush instanceof PushWrapper)) {
        throw new TypeError("wrapperPush is not an instance of PushWrapper");
    }

    this._wrapperPush = wrapperPush;
};

/*
 *
 * function getWrapperPublic()
 *
 * Get the public wrapper instance.
 *
 */
OrderBook.prototype.getWrapperPublic = function() {
    return this._wrapperPublic;
};

/*
 *
 * function setWrapperPublic(wrapperPublic)
 *
 * Set the public wrapper instance.
 *
 */
OrderBook.prototype.setWrapperPublic = function(wrapperPublic) {
    // Lock while running
    if (this._running) {
        throw "Public wrapper instance cannot be changed while running";
    }

    // Sanity check
    if (!(wrapperPublic instanceof PublicWrapper)) {
        throw new TypeError("wrapperPublic is not an instance of PublicWrapper");
    }

    this._wrapperPublic = wrapperPublic;
};

/*
 *
 * function getCurrencyPair()
 *
 * Get the target currency pair.
 *
 */
OrderBook.prototype.getCurrencyPair = function() {
    return this._currencyPair;
};

/*
 *
 * function setCurrencyPair(currencyPair)
 *
 * Set the target currency pair.
 *
 */
OrderBook.prototype.setCurrencyPair = function(currencyPair) {
    // Lock while running
    if (this._running) {
        throw "Currency pair cannot be changed while running";
    }

    this._currencyPair = currencyPair;
};

/*
 *
 * function useDefaultWrappers()
 *
 * Create new push and public wrappers and use them.
 *
 */
OrderBook.prototype.useDefaultWrappers = function() {
    this.setWrapperPush(new PushWrapper());
    this.setWrapperPublic(new PublicWrapper());
};

/*
 *
 * function start()
 *
 * Start tracking the target currency pair's order book.
 *
 */
OrderBook.prototype.start = function() {
    // Sanity check
    if (this._running) {
        throw "Attempt to start, but already running";
    }

    // Start listening to the push API
    this._wrapperPush.orderTrade(this.currencyPair, (err, response) => {
        // Disconnect as soon as running flag is cleared
        if (!this._running) {
            return true;
        }

        // If an error occurred
        if (err) {
            // TODO: Handle error
        }

        // Handle update
        this._handleUpdate(response);
    });

    // Set running flag
    this._running = true;
};

/*
 *
 * function stop()
 *
 * Stop tracking the target currency pair's order book.
 *
 */
OrderBook.prototype.stop = function() {
    // Sanity check
    if (!this._running) {
        throw "Attempt to stop, but not running";
    }

    // Clear running flag
    this._running = false;

    // TODO: Do any necessary cleanup
};

/*
 *
 * function onStart(callback)
 *
 * Register a callback to receive start events.
 *
 */
OrderBook.prototype.onStart = function(callback) {
    // Push to start callback set
    this._callbackSetStart.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from start callback set
            this._callbackSetStart.splice(this._callbackSetStart.indexOf(callback), 1);
        }
    };
};

/*
 *
 * function onStop(callback)
 *
 * Register a callback to receive stop events.
 *
 */
OrderBook.prototype.onStop = function(callback) {
    // Push to stop callback set
    this._callbackSetStop.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from stop callback set
            this._callbackSetStop.splice(this._callbackSetStop.indexOf(callback), 1);
        }
    };
};

/*
 *
 * function onSync(callback)
 *
 * Register a callback to receive sync events.
 *
 */
OrderBook.prototype.onSync = function(callback) {
    // Push to sync callback set
    this._callbackSetSync.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from sync callback set
            this._callbackSetSync.splice(this._callbackSetSync.indexOf(callback), 1);
        }
    };
};

/*
 *
 * function onLoseSync(callback)
 *
 * Register a callback to receive lose sync events.
 *
 */
OrderBook.prototype.onLoseSync = function(callback) {
    // Push to lose sync callback set
    this._callbackSetLoseSync.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from lose sync callback set
            this._callbackSetLoseSync.splice(this._callbackSetLoseSync.indexOf(callback), 1);
        }
    };
};

/*
 * Internal function to handle order book updates.
 */
OrderBook.prototype._handleUpdate = function(update) {
    console.log("Received update with seq #" + update.seq);
};

module.exports = OrderBook;
