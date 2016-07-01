
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

// Import modules
var events = require("events");

// Localize wrappers
var PushWrapper = module.parent.exports.PushWrapper;
var PublicWrapper = module.parent.exports.PublicWrapper;

// Do not continue without these wrappers
if (!PushWrapper || !PublicWrapper) {
    throw "Failed to localize wrappers (OrderBook.js should not be require()'d externally)";
}

// Default size of update buffer
const DEFAULT_UPDATE_BUFFER_MAX_SIZE = 16;

// Enums for table sort directions
const TABLE_SORT_INCREASING = 1;
const TABLE_SORT_DECREASING = -1;

/*
 * Order book utility constructor.
 */
function OrderBook(currencyPair) {
    this._currencyPair = currencyPair;

    this._updateBufferMaxSize = DEFAULT_UPDATE_BUFFER_MAX_SIZE;

    this._wrapperPush = new PushWrapper();
    this._wrapperPublic = new PublicWrapper();

    this._running = false;

    this._synchronized = false;
    this._synchronizing = false;

    this._asks = new this._Table();
    this._bids = new this._Table();

    this._lastSeq = -2;

    this._updateBuffer = new Array();

    this._eventEmitter = new events.EventEmitter();

    // Initialize metrics
    this._metrics = {
        "spread": 0,
        "askSumAmount": 0,
        "askSumTotal": 0,
        "bidSumAmount": 0,
        "bidSumTotal": 0
    };

    // Sort asks and bids tables appropriately (inc. and dec., respectively)
    this._asks.setSortDir(TABLE_SORT_INCREASING);
    this._bids.setSortDir(TABLE_SORT_DECREASING);
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
 * function getUpdateBufferMaxSize()
 *
 * Get the update buffer maximum size.
 *
 */
OrderBook.prototype.getUpdateBufferMaxSize = function() {
    return this._updateBufferMaxSize;
};

/*
 *
 * function setUpdateBufferMaxSize(updateBufferMaxSize)
 *
 * Set the update buffer maximum size.
 *
 */
OrderBook.prototype.setUpdateBufferMaxSize = function(updateBufferMaxSize) {
    this._updateBufferMaxSize = updateBufferMaxSize;
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
        // Stop if an error occurred
        if (err) {
            this.stop(err);

            return true;
        }

        // Disconnect as soon as running flag is cleared
        if (!this._running) {
            return true;
        }

        // Buffer update
        this._bufferUpdate(response);
    });

    // Set running flag
    this._running = true;

    // Emit start event
    this._eventEmitter.emit("start");
};

/*
 *
 * function stop([err])
 *
 * Stop tracking the target currency pair's order book with an optional error
 * object.
 *
 */
OrderBook.prototype.stop = function(err) {
    // Sanity check
    if (!this._running) {
        throw "Attempt to stop, but not running";
    }

    // Clear running flag
    this._running = false;

    // Emit stop event with error
    this._eventEmitter.emit("stop", err);
};

/*
 *
 * function getAskAt(index)
 *
 * Get ask at a particular index. Asks are ordered lowest (index 0) to highest
 * by rate (in the base currency).
 *
 */
OrderBook.prototype.getAskAt = function(index) {
    return this._asks.getEntries()[index];
};

/*
 *
 * function getNumAsks()
 *
 * Get the total number of asks in this order book.
 *
 */
OrderBook.prototype.getNumAsks = function() {
    return this._asks.getEntries().length;
};

/*
 *
 * function getBidAt(index)
 *
 * Get bid at a particular index. Bids are ordered highest (index 0) to lowest
 * by rate (in the base currency).
 *
 */
OrderBook.prototype.getBidAt = function(index) {
    return this._bids.getEntries()[index];
};

/*
 *
 * function getNumBids()
 *
 * Get the total number of bids in this order book.
 *
 */
OrderBook.prototype.getNumBids = function() {
    return this._bids.getEntries().length;
};

/*
 *
 * function getMetrics()
 *
 * TODO: Write me
 *
 */
OrderBook.prototype.getMetrics = function() {
    return this._metrics;
};

/*
 *
 * function getUpdateBufferSize()
 *
 * Get the size of the update buffer.
 *
 */
OrderBook.prototype.getUpdateBufferSize = function() {
    return this._updateBuffer.length;
};

/*
 *
 * function onStart(callback)
 *
 * Register a callback to receive start events.
 *
 */
OrderBook.prototype.onStart = function(callback) {
    // Listen for start event
    this._eventEmitter.on("start", callback);
};

/*
 *
 * function onStop(callback)
 *
 * Register a callback to receive stop events.
 *
 */
OrderBook.prototype.onStop = function(callback) {
    // Listen for stop event
    this._eventEmitter.on("stop", callback);
};

/*
 *
 * function onSyncBegin(callback)
 *
 * Register a callback to receive sync begin events.
 *
 */
OrderBook.prototype.onSyncBegin = function(callback) {
    // Listen for syncBegin event
    this._eventEmitter.on("syncBegin", callback);
};

/*
 *
 * function onSyncComplete(callback)
 *
 * Register a callback to receive sync complete events.
 *
 */
OrderBook.prototype.onSyncComplete = function(callback) {
    // Listen for syncComplete event
    this._eventEmitter.on("syncComplete", callback);
};

/*
 *
 * function onSyncLost(callback)
 *
 * Register a callback to receive sync lost events.
 *
 */
OrderBook.prototype.onSyncLost = function(callback) {
    // Listen for syncLost event
    this._eventEmitter.on("syncLost", callback);
};

/*
 *
 * function onUpdate(callback)
 *
 * Register a callback to receive update events.
 *
 */
OrderBook.prototype.onUpdate = function(callback) {
    // Listen for update event
    this._eventEmitter.on("update", callback);
};

/*
 * Internal function to buffer updates and ensure they are handled sequentially.
 */
OrderBook.prototype._bufferUpdate = function(update) {
    // Remove obsolete updates from buffer
    for (var i = 0; i < this._updateBuffer.length; i++) {
        if (this._updateBuffer[i].seq < this._lastSeq) {
            this._updateBuffer.splice(i--, 1);
        }
    }

    // If synchronized and update is first or sequential
    if (this._synchronized && (this._lastSeq < 0 || update.seq == this._lastSeq || update.seq == this._lastSeq + 1)) {
        // Directly handle the update
        this._handleUpdate(update);
    } else {
        // If buffer is empty
        if (this._updateBuffer.length == 0) {
            // Add update
            this._updateBuffer[0] = update;
        } else {
            // Oldest update from the buffer, its index, and its seq number
            var oldestUpdate = null;
            var oldestUpdateIdx = -1;
            var oldestUpdateSeq = -2;

            // Find the oldest update in the buffer
            for (var i = 0; i < this._updateBuffer.length; i++) {
                if (oldestUpdateSeq == -2 || this._updateBuffer[i].seq < oldestUpdateSeq) {
                    oldestUpdate = this._updateBuffer[i];
                    oldestUpdateIdx = i;
                    oldestUpdateSeq = this._updateBuffer[i].seq;
                }
            }

            // If oldest update exists, but isn't sequential, and there's room to keep buffering
            if (oldestUpdate != null && oldestUpdateSeq != this._lastSeq && oldestUpdateSeq != this._lastSeq + 1 && this._updateBuffer.length < this._updateBufferSize) {
                // Add update to buffer
                this._updateBuffer.push(update);
            } else {
                // Replace oldest update with new update
                this._updateBuffer[oldestUpdateIdx] = update;

                // Handle the displaced oldest update
                this._handleUpdate(oldestUpdate);

                // Search for and handle pending consecutive updates (to stay up to date in case of inactivity)
                for (var seq = oldestUpdateSeq + 1; seq <= oldestUpdateSeq + this._updateBuffer.length + 1; seq++) {
                    // Search through update buffer for this seq number
                    for (var i = 0; i < this._updateBuffer.length; i++) {
                        // If seq number matches
                        if (this._updateBuffer[i].seq == seq) {
                            // Handle the update
                            this._handleUpdate(this._updateBuffer[i]);

                            // Remove update
                            this._updateBuffer.splice(i--, 1);
                        }
                    }
                }
            }
        }
    }
};

/*
 * Internal function to handle buffered order book updates.
 */
OrderBook.prototype._handleUpdate = function(update) {
    // If not yet synchronized or currently synchronizing
    if (!this._synchronized || this._synchronizing) {
        // If not currently synchronizing
        if (!this._synchronizing) {
            // Set synchronizing flag
            this._synchronizing = true;

            // Emit syncBegin event
            this._eventEmitter.emit("syncBegin");

            // Request full snapshot of order book from public API (well, hopefully full!)
            this._wrapperPublic.returnOrderBook(this._currencyPair, 999999999, (err, response) => {
                // Stop if an error occurred
                if (err) {
                    this.stop(err);

                    return;
                }

                // If this market is frozen
                if (response.isFrozen == "1") {
                    throw "Market for " + update.currencyPair + " is frozen";
                }

                // Store seq from snapshot
                this._lastSeq = response.seq;

                // Clear asks and bids tables
                this._asks.clear();
                this._bids.clear();

                // Copy snapshot ask data to asks table
                for (var i = 0; i < response.asks.length; i++) {
                    // Poloniex sends rate as a string and amount as a number
                    this._asks.set(parseFloat(response.asks[i][0]), response.asks[i][1], i < response.asks.length - 1);
                }

                // Copy snapshot bid data to bids table
                for (var i = 0; i < response.bids.length; i++) {
                    // Poloniex sends rate as a string and amount as a number
                    this._bids.set(parseFloat(response.bids[i][0]), response.bids[i][1],  i < response.bids.length - 1);
                }

                // Synchronized; set flags accordingly
                this._synchronized = true;
                this._synchronizing = false;

                // Emit syncComplete event
                this._eventEmitter.emit("syncComplete");
            });
        }

        // Wait for next update to begin tracking updates
        return;
    }

    // If this update's seq is greater than, but not equal or 1 higher than the last update's seq
    if (update.seq > this._lastSeq && update.seq != this._lastSeq && update.seq != this._lastSeq + 1) {
        // Consider this a loss of synchronization
        this._synchronized = false;

        // Buffer this update to re-evaluate it
        this._updateBuffer.push(update);

        // Emit syncLost event
        this._eventEmitter.emit("syncLost");

        // Wait for next update to begin synchronization
        return;
    }

    // Store seq for future comparison
    this._lastSeq = update.seq;

    // Handle update by type
    switch (update.updateType) {
    case "orderBookModify":
        // Parse rate and amount to numbers
        var updateRate = parseFloat(update.rate);
        var updateAmount = parseFloat(update.amount);

        // Apply update to appropriate table
        if (update.type == "ask") {
            this._asks.set(updateRate, updateAmount);
        } else if (update.type == "bid") {
            this._bids.set(updateRate, updateAmount);
        }
        break;
    case "orderBookRemove":
        // Parse rate to a number
        var updateRate = parseFloat(update.rate);

        // Remove row from appropriate table
        if (update.type == "ask") {
            this._asks.remove(updateRate);
        } else if (update.type == "bid") {
            this._bids.remove(updateRate);
        }
        break;
    }

    // (Re)calculate metrics
    this._updateMetrics();

    // Emit update event
    this._eventEmitter.emit("update");
};

/*
 * Internal function to calculate metrics.
 */
OrderBook.prototype._updateMetrics = function() {
    // If neither table is empty
    if (this.getNumAsks() > 0 && this.getNumBids() > 0) {
        // Bid-ask spread (difference between highest bid rate and lowest ask rate)
        this._metrics.spread = this.getAskAt(0).rate - this.getBidAt(0).rate;
    }

    // Copy asks table metrics
    this._metrics.askSumAmount = this._asks.getMetrics().sumAmount;
    this._metrics.askSumTotal = this._asks.getMetrics().sumTotal;

    // Copy bids table metrics
    this._metrics.bidSumAmount = this._bids.getMetrics().sumAmount;
    this._metrics.bidSumTotal = this._bids.getMetrics().sumTotal;
};

/*
 * Representation of a bid/ask table with sorted, unique, rate-indexed entries
 * that map to arbitrary data.
 */
OrderBook.prototype._Table = function() {
    this._sortDir = 0;
    this._entries = new Array();

    // Initialize metrics
    this._metrics = {
        "sumAmount": 0,
        "sumTotal": 0
    };
};

/*
 * Get this table's sort direction
 */
OrderBook.prototype._Table.prototype.getSortDir = function() {
    return this._sortDir;
};

/*
 * Set this table's sort direction.
 */
OrderBook.prototype._Table.prototype.setSortDir = function(sortDir) {
    this._sortDir = sortDir;
};

/*
 * Get this table's entries.
 */
OrderBook.prototype._Table.prototype.getEntries = function() {
    return this._entries;
};

/*
 * Get this table's metrics.
 */
OrderBook.prototype._Table.prototype.getMetrics = function() {
    return this._metrics;
};

/*
 * Remove all entries from this table.
 */
OrderBook.prototype._Table.prototype.clear = function() {
    // Remove all entries
    this._entries.splice(0, this._entries.length);

    // Update metrics to reflect clear
    this._metrics.sumAmount = 0;
    this._metrics.sumTotal = 0;
};

/*
 * Set (add or overwrite) an entry in this table. An entry consists of a rate
 * and a set of data specific to this rate. Sorting will be preserved.
 */
OrderBook.prototype._Table.prototype.set = function(rate, amount, skipSort) {
    // Total value at this rate (in the base currency)
    var total = rate * amount;

    // Iterate over entries
    for (var i = 0; i < this._entries.length; i++) {
        // If rate matches
        if (this._entries[i].rate == rate) {
            // Update metrics to reflect change
            this._metrics.sumAmount += amount - this._entries[i].amount;
            this._metrics.sumTotal += total - this._entries[i].total;

            // Update existing entry
            this._entries[i].amount = amount;
            this._entries[i].total = total;

            // No need to continue
            return;
        }
    }

    // Insert entry at beginning of table
    this._entries.splice(0, 0, {
        "rate": rate,
        "amount": amount,
        "total": total
    });

    // Update metrics to reflect addition
    this._metrics.sumAmount += amount;
    this._metrics.sumTotal += total;

    // If sorting shouldn't be skipped
    if (!skipSort) {
        // Sort table
        this._entries.sort((a, b) => {
            if (this._sortDir == TABLE_SORT_INCREASING) {
                return a.rate - b.rate;
            } else if (this._sortDir == TABLE_SORT_DECREASING) {
                return b.rate - a.rate;
            }
        });
    }
};

/*
 * Remove the entry with the given rate from this table.
 */
OrderBook.prototype._Table.prototype.remove = function(rate) {
    // Iterate over entries
    for (var i = 0; i < this._entries.length; i++) {
        // If rate matches
        if (this._entries[i].rate == rate) {
            // Update metrics to reflect removal
            this._metrics.sumAmount -= this._entries[i].amount;
            this._metrics.sumTotal -= this._entries[i].total;

            // Remove this entry
            this._entries.splice(i, 1);

            break;
        }
    }
};

module.exports = OrderBook;
