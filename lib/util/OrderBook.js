
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

// Size of update buffer (greater is more stable, but increases sync duration)
const UPDATE_BUFFER_SIZE = 5;

/*
 * Order book utility constructor.
 */
function OrderBook(currencyPair) {
    this._currencyPair = currencyPair;

    this._asks = null;
    this._bids = null;

    this._wrapperPush = null;
    this._wrapperPublic = null;

    this._running = false;

    this._buffer = new Array();

    this._synchronized = false;
    this._synchronizing = false;
    this._syncReady = false;

    this._lastSeq = -2;

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
    this._wrapperPush.orderTrade(this._currencyPair, (err, response) => {
        // Disconnect as soon as running flag is cleared
        if (!this._running) {
            return true;
        }

        // If an error occurred
        if (err) {
            throw "Push wrapper: " + err.msg;
        }

        // Buffer update
        this._bufferUpdate(response);
    });

    // Set running flag
    this._running = true;

    // Notify onStart callbacks
    for (var i = 0; i < this._callbackSetStart.length; i++) {
        this._callbackSetStart[i]();
    }
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

    // Notify onStop callbacks
    for (var i = 0; i < this._callbackSetStop.length; i++) {
        this._callbackSetStop[i]();
    }
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
 * Internal function to buffer order book updates.
 */
OrderBook.prototype._bufferUpdate = function(update) {
    // TODO: Make buffer size configurable
    if (this._buffer.length < UPDATE_BUFFER_SIZE) {
        // Add new update to buffer
        this._buffer.push(update);
    } else {
        // Oldest update from the buffer and its accompanying seq
        var oldestUpdate = null;
        var oldestUpdateIdx = -1;
        var oldestUpdateSeq = -1;

        // Select the oldest update from the buffer
        for (var i = 0; i < this._buffer.length; i++) {
            if (oldestUpdateSeq == -1 || this._buffer[i].seq < oldestUpdateSeq) {
                oldestUpdate = this._buffer[i];
                oldestUpdateIdx = i;
                oldestUpdateSeq = this._buffer[i].seq;
            }
        }

        // Replace oldest update with new updates
        this._buffer[oldestUpdateIdx] = update;

        // Handle the displaced oldest update
        this._handleUpdate(oldestUpdate);
    }
};

/*
 * Internal function to handle buffered order book updates.
 */
OrderBook.prototype._handleUpdate = function(update) {
    // Store seq for future comparison
    this._lastSeq = update.seq;

    // If not yet synchronized or currently synchronizing
    if (!this._synchronized || this._synchronizing) {
        // If not currently synchronizing
        if (!this._synchronizing) {
            // Set synchronizing flag
            this._synchronizing = true;

            // Request snapshot of order book from public API (TODO: Use a configurable depth)
            this._wrapperPublic.returnOrderBook(this._currencyPair, 999999999, (err, response) => {
                // If this market is frozen
                if (response.isFrozen == "1") {
                    throw "Market for " + update.currencyPair + " is frozen";
                }

                // Store seq from snapshot
                this._lastSeq = response.seq;

                // Reset order book data
                this._asks = new Array();
                this._bids = new Array();

                // Store data from snapshot
                for (var i = 0; i < response.asks.length; i++) {
                    this._asks.push({
                        "rate": response.asks[i][0],
                        "amount": response.asks[i][1]
                    });
                }
                for (var i = 0; i < response.bids.length; i++) {
                    this._bids.push({
                        "rate": response.bids[i][0],
                        "amount": response.bids[i][1]
                    });
                }

                // Set synchronized flag and clear synchronizing flag
                this._synchronized = true;
                this._synchronizing = false;

                // Notify onSync callbacks
                for (var i = 0; i < this._callbackSetSync.length; i++) {
                    this._callbackSetSync[i]();
                }
            });
        }

        // Wait for next update to begin tracking updates
        return;
    }

    // If this update's seq is greater than, but not equal or 1 higher than the last update's seq
    if (update.seq > this._lastSeq && update.seq != this._lastSeq && update.seq != this._lastSeq + 1) {
        // Consider this a loss of synchronization
        this._synchronized = false;

        // Notify onLoseSync callbacks
        for (var i = 0; i < this._callbackSetLoseSync.length; i++) {
            this._callbackSetLoseSync[i]();
        }

        // Wait for next update to begin synchronization
        return;
    }

    // Handle update
    switch (update.updateType) {
    case "orderBookModify":
        // Update amount of appropriate table
        if (update.type == "ask") {
            // Whether or not the rate is already listed
            var existing = false;

            // Modify existing value if it exists
            for (var i = 0; i < this._asks.length; i++) {
                if (this._asks[i].rate == update.rate) {
                    this._asks[i].amount = update.amount;
                    existing = true;
                }
            }

            // If value didn't already exist
            if (!existing) {
                // Add it
                this._asks.push({
                    "rate": update.asks[i][0],
                    "amount": update.asks[i][1]
                });
            }
        } else if (update.type == "bid") {
            // Whether or not the rate is already listed
            var existing = false;

            // Modify existing value if it exists
            for (var i = 0; i < this._bids.length; i++) {
                if (this._bids[i].rate == update.rate) {
                    this._bids[i].amount = update.amount;
                    existing = true;
                }
            }

            // If value didn't already exist
            if (!existing) {
                // Add it
                this._bids.push({
                    "rate": update.bids[i][0],
                    "amount": update.bids[i][1]
                });
            }
        }
        break;
    case "orderBookRemove":
        // Remove row from appropriate table
        if (update.type == "ask") {
            // Remove existing value from ask table
            for (var i = 0; i < this._asks.length; i++) {
                if (this._asks[i].rate == update.rate) {
                    this._asks.splice(i, 1);
                    break;
                }
            }
        } else if (update.type == "bid") {
            // Remove existing value from bid table
            for (var i = 0; i < this._bids.length; i++) {
                if (this._bids[i].rate == update.rate) {
                    this._bids.splice(i, 1);
                    break;
                }
            }
        }
        break;
    }
};

module.exports = OrderBook;
