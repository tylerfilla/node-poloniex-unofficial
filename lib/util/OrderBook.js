
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

// Default size of update buffer
const DEFAULT_UPDATE_updateBuffer_SIZE = 5;

/*
 * Order book utility constructor.
 */
function OrderBook(currencyPair) {
    this._currencyPair = currencyPair;

    this._updateBufferSize = DEFAULT_UPDATE_updateBuffer_SIZE;

    this._wrapperPush = new PushWrapper();
    this._wrapperPublic = new PublicWrapper();

    this._running = false;

    this._synchronized = false;
    this._synchronizing = false;

    this._asks = null;
    this._bids = null;

    this._lastSeq = -2;

    this._updateBuffer = new Array();

    this._callbackSetStart = new Array();
    this._callbackSetStop = new Array();
    this._callbackSetSyncBegin = new Array();
    this._callbackSetSyncComplete = new Array();
    this._callbackSetSyncLost = new Array();
    this._callbackSetUpdate = new Array();
}

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
 * function getUpdateBufferSize()
 *
 * Get the update buffer size.
 *
 */
OrderBook.prototype.getUpdateBufferSize = function() {
    return this._updateBufferSize;
};

/*
 *
 * function setUpdateBufferSize(updateBufferSize)
 *
 * Set the update buffer size.
 *
 */
OrderBook.prototype.setUpdateBufferSize = function(updateBufferSize) {
    this._updateBufferSize = updateBufferSize;
};

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
 * function isRunning()
 *
 * Get whether the tracker is currently running (between start and stop calls).
 *
 */
OrderBook.prototype.isRunning = function() {
    return this._running;
};

/*
 *
 * function isSynchronized()
 *
 * Get whether the tracker has synchronized push and public APIs.
 *
 */
OrderBook.prototype.isSynchronized = function() {
    return this._synchronized;
};

/*
 *
 * function isSynchronizing()
 *
 * Get whether the tracker is currently synchronizing push and public APIs.
 *
 */
OrderBook.prototype.isSynchronizing = function() {
    return this._synchronizing;
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

    // Ensure wrappers are supplied
    if (!this._wrapperPush || !this._wrapperPublic) {
        throw "Push and/or public wrapper instance(s) not supplied";
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
 * function onSyncBegin(callback)
 *
 * Register a callback to receive sync begin events.
 *
 */
OrderBook.prototype.onSyncBegin = function(callback) {
    // Push to sync begin callback set
    this._callbackSetSyncBegin.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from sync begin callback set
            this._callbackSetSyncBegin.splice(this._callbackSetSyncBegin.indexOf(callback), 1);
        }
    };
};

/*
 *
 * function onSyncComplete(callback)
 *
 * Register a callback to receive sync complete events.
 *
 */
OrderBook.prototype.onSyncComplete = function(callback) {
    // Push to sync begin callback set
    this._callbackSetSyncComplete.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from sync complete callback set
            this._callbackSetSyncComplete.splice(this._callbackSetSyncComplete.indexOf(callback), 1);
        }
    };
};

/*
 *
 * function onSyncLost(callback)
 *
 * Register a callback to receive sync lost events.
 *
 */
OrderBook.prototype.onSyncLost = function(callback) {
    // Push to sync lost callback set
    this._callbackSetSyncLost.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from sync lost callback set
            this._callbackSetSyncLost.splice(this._callbackSetSyncLost.indexOf(callback), 1);
        }
    };
};

/*
 *
 * function onUpdate(callback)
 *
 * Register a callback to receive update events.
 *
 */
OrderBook.prototype.onUpdate = function(callback) {
    // Push to update callback set
    this._callbackSetUpdate.push(callback);

    // Give user the option to remove it
    return {
        "remove": () => {
            // Remove from update callback set
            this._callbackSetUpdate.splice(this._callbackSetUpdate.indexOf(callback), 1);
        }
    };
};

/*
 * Internal function to buffer order book updates and handle overflow.
 */
OrderBook.prototype._bufferUpdate = function(update) {
    if (this._updateBuffer.length < this._updateBufferSize) {
        // Add new update to buffer
        this._updateBuffer.push(update);
    } else {
        // Oldest update from the buffer and its accompanying seq number
        var oldestUpdate = null;
        var oldestUpdateIdx = -1;
        var oldestUpdateSeq = -1;

        // Select the oldest update from the buffer
        for (var i = 0; i < this._updateBuffer.length; i++) {
            if (oldestUpdateSeq == -1 || this._updateBuffer[i].seq < oldestUpdateSeq) {
                oldestUpdate = this._updateBuffer[i];
                oldestUpdateIdx = i;
                oldestUpdateSeq = this._updateBuffer[i].seq;
            }
        }

        // If oldest update exists
        if (oldestUpdate) {
            // Replace oldest update with new update
            this._updateBuffer[oldestUpdateIdx] = update;

            // Handle the displaced oldest update
            this._handleUpdate(oldestUpdate);

            // Search for and handle pending consecutive updates (to stay up to date in case of inactivity)
            for (var seq = oldestUpdateSeq + 1; seq <= oldestUpdateSeq + this._updateBuffer.length; seq++) {
                // Whether or not an update(s) with this seq number was found
                var matched = false;

                // Search through update buffer for this seq number
                for (var i = 0; i < this._updateBuffer.length; i++) {
                    // Get this update
                    var update = this._updateBuffer[i];

                    // If seq matches
                    if (this._updateBuffer[i].seq == seq) {
                        // Set matched flag
                        matched = true;

                        // Handle the update
                        this._handleUpdate(update);
                    }
                }

                // Stop searching for consecutive updates if no match was found
                if (!matched) {
                    break;
                }
            }
        } else {
            // Handle new update directly
            this._handleUpdate(update);
        }
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

            // Notify onSyncBegin callbacks
            for (var i = 0; i < this._callbackSetSyncBegin.length; i++) {
                this._callbackSetSyncBegin[i]();
            }

            // Request full snapshot of order book from public API (well, hopefully full!)
            this._wrapperPublic.returnOrderBook(this._currencyPair, 999999999, (err, response) => {
                // If this market is frozen
                if (response.isFrozen == "1") {
                    throw "Market for " + update.currencyPair + " is frozen";
                }

                // Store seq from snapshot
                this._lastSeq = response.seq;

                // Reset order book tables
                this._asks = new Array();
                this._bids = new Array();

                // Copy asks
                for (var i = 0; i < response.asks.length; i++) {
                    this._asks.push({
                        "rate": parseFloat(response.asks[i][0]),
                        "amount": parseFloat(response.asks[i][1])
                    });
                }

                // Sort asks ascending by rate
                this._asks.sort((a, b) => {
                    return a.rate - b.rate;
                });

                // Copy bids
                for (var i = 0; i < response.bids.length; i++) {
                    // Add row to bids table
                    this._bids.push({
                        "rate": parseFloat(response.bids[i][0]),
                        "amount": parseFloat(response.bids[i][1])
                    });
                }

                // Sort bids descending by rate
                this._asks.sort((a, b) => {
                    return b.rate - a.rate;
                });

                // Synchronized; set flags accordingly
                this._synchronized = true;
                this._synchronizing = false;

                // Notify onSyncComplete callbacks
                for (var i = 0; i < this._callbackSetSyncComplete.length; i++) {
                    this._callbackSetSyncComplete[i]();
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

        // Notify onSyncLost callbacks
        for (var i = 0; i < this._callbackSetSyncLost.length; i++) {
            this._callbackSetSyncLost[i]();
        }

        // Wait for next update to begin synchronization
        return;
    }

    // Handle update
    switch (update.updateType) {
    case "orderBookModify":
        // Apply update to appropriate table
        if (update.type == "ask") {
            // Modify bids table
            this._modifyTable(this._asks, update);

            // Sort asks ascending by rate
            this._asks.sort((a, b) => {
                return a.rate - b.rate;
            });
        } else if (update.type == "bid") {
            // Modify bids table
            this._modifyTable(this._bids, update);

            // Sort bids decending by rate
            this._bids.sort((a, b) => {
                return b.rate - a.rate;
            });
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

    // Notify onUpdate callbacks
    for (var i = 0; i < this._callbackSetUpdate.length; i++) {
        this._callbackSetUpdate[i]();
    }
};

/*
 * Internal function to modify a particular table with an update.
 */
OrderBook.prototype._modifyTable = function(table, update) {
    // Iterate over table
    for (var i = 0; i < table.length; i++) {
        // If this row's rate equals the update's rate
        if (table[i].rate == update.rate) {
            // Update this row
            table[i].amount = update.amount;

            return;
        }
    }

    // Rate isn't already listed, so add it
    table.push({
        "rate": parseFloat(update.rate),
        "amount": parseFloat(update.amount)
    });
};

module.exports = OrderBook;
