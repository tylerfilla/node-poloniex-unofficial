
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

// Import modules
const events = require("events");

// Localize wrappers
const PushWrapper = module.parent.exports.PushWrapper;
const PublicWrapper = module.parent.exports.PublicWrapper;

// Do not continue without these wrappers
if (!PushWrapper || !PublicWrapper) {
    throw "Failed to localize wrappers (OrderBook.js should not be require()'d externally)";
}

/*
 * Order book utility constructor.
 */
function OrderBook(currencyPair) {
    this._currencyPair = currencyPair;

    this._updateBufferMaxSize = OrderBook.DEFAULT_UPDATE_BUFFER_MAX_SIZE;

    this._wrapperPush = new PushWrapper();
    this._wrapperPublic = new PublicWrapper();

    this._statusRunning = false;
    this._statusSync = OrderBook.SYNC_STATUS_DESYNCHRONIZED;

    this._asks = new Table();
    this._bids = new Table();

    this._lastHandledSeq = -1;

    this._updateBuffer = new Array();

    this._eventEmitter = new events.EventEmitter();

    this._metrics = {
        "spread": 0,
        "askSumAmount": 0,
        "askSumTotal": 0,
        "bidSumAmount": 0,
        "bidSumTotal": 0
    };
}

/*
 * Default maximum size of update buffer.
 */
OrderBook.DEFAULT_UPDATE_BUFFER_MAX_SIZE = 8;

/*
 * Enums for sync status.
 */
OrderBook.SYNC_STATUS_DESYNCHRONIZED = 0;
OrderBook.SYNC_STATUS_SYNCHRONIZING = 1;
OrderBook.SYNC_STATUS_SYNCHRONIZED = 2;

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
    if (this._statusRunning) {
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
    if (this._statusRunning) {
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
    if (this._statusRunning) {
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
    return this._statusRunning;
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
    if (this._statusRunning) {
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
        if (!this._statusRunning) {
            return true;
        }

        // Buffer update
        this._bufferUpdate(response);
    });

    // Set running flag
    this._statusRunning = true;

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
    if (!this._statusRunning) {
        throw "Attempt to stop, but not running";
    }

    // Clear running flag
    this._statusRunning = false;

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
 * Get a set of metrics about this order book.
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
 * To do so, this function controls the synchronization process. Out-of-order
 * updates will be buffered if they come from the future, where they will be
 * dequeued sequentially as soon as any missing update(s) fill in.
 */
OrderBook.prototype._bufferUpdate = function(update) {
    // Deal with update based on sync status
    if (this._statusSync == OrderBook.SYNC_STATUS_DESYNCHRONIZED) {
        // Set sync status to synchronizing
        this._statusSync = OrderBook.SYNC_STATUS_SYNCHRONIZING;

        // Emit syncBegin event
        this._eventEmitter.emit("syncBegin");

        // Request full snapshot of order book from public API
        this._wrapperPublic.returnOrderBook(this._currencyPair, 999999, (err, response) => {
            // Stop if an error occurred
            if (err) {
                this.stop(err);

                return;
            }

            // If this market is frozen
            if (response.isFrozen == "1") {
                throw "Market for " + update.currencyPair + " is frozen";
            }

            // Drop updates from buffer that occurred before this snapshot
            for (var i = 0; i < this._updateBuffer.length; i++) {
                if (this._updateBuffer[i].seq <= response.seq) {
                    this._updateBuffer.splice(i--, 1);
                }
            }

            // Update seq number from snapshot
            this._lastHandledSeq = response.seq;

            // Clear asks and bids tables
            this._asks.clear();
            this._bids.clear();

            // Copy snapshot ask data to asks table
            for (var i = 0; i < response.asks.length; i++) {
                // Add entry to asks table
                this._asks.add(new TableEntry(parseFloat(response.asks[i][0]), response.asks[i][1]));
            }

            // Copy snapshot bid data to bids table
            for (var i = 0; i < response.bids.length; i++) {
                // Add entry to bids table
                this._bids.add(new TableEntry(parseFloat(response.bids[i][0]), response.bids[i][1]));
            }

            // Set status to synchronized
            this._statusSync = OrderBook.SYNC_STATUS_SYNCHRONIZED;

            // Emit syncComplete event
            this._eventEmitter.emit("syncComplete");
        });
    } else if (this._statusSync == OrderBook.SYNC_STATUS_SYNCHRONIZING) {
        // Add update to buffer
        this._updateBuffer.push(update);

        // If this addition made buffer exceed max size
        if (this._updateBuffer.length > this._updateBufferMaxSize) {
            // Index of oldest update in buffer
            var oldestIdx = -1;

            // Find the oldest update (not stable in the event of duplicates)
            for (var i = 0; i < this._updateBuffer.length; i++) {
                if (oldestIdx == -1 || this._updateBuffer[i].seq < this._updateBuffer[oldestIdx].seq) {
                    oldestIdx = i;
                }
            }

            // Drop all buffered updates with the same seq number as oldest update
            for (var i = 0; i < this._updateBuffer.length; i++) {
                if (this._updateBuffer[i].seq == this._updateBuffer[oldestIdx].seq) {
                    this._updateBuffer.splice(i--, 1);
                }
            }
        }
    } else if (this._statusSync == OrderBook.SYNC_STATUS_SYNCHRONIZED) {
        // If update is consecutive
        if (update.seq == this._lastHandledSeq || update.seq == this._lastHandledSeq + 1) {
            // Handle it directly
            this._handleUpdate(update);
        } else {
            // Add update to buffer
            this._updateBuffer.push(update);

            // Indices of oldest and newst updates in buffer
            var oldestIdx = -1;
            var newestIdx = -1;

            // Find the oldest and newest updates (not stable in the event of duplicates)
            for (var i = 0; i < this._updateBuffer.length; i++) {
                if (oldestIdx == -1 || this._updateBuffer[i].seq < this._updateBuffer[oldestIdx].seq) {
                    oldestIdx = i;
                }
                if (newestIdx == -1 || this._updateBuffer[i].seq > this._updateBuffer[newestIdx].seq) {
                    newestIdx = i;
                }
            }

            // Get oldest and newest updates' seq numbers
            var oldestSeq = this._updateBuffer[oldestIdx].seq;
            var newestSeq = this._updateBuffer[newestIdx].seq;

            // Handle as many consecutive updates as possible currently in the buffer
            for (var seq = oldestSeq; seq <= newestSeq; seq++) {
                // Was this seq found?
                var found = false;

                // Search through update buffer for this seq number
                for (var i = 0; i < this._updateBuffer.length; i++) {
                    // If seq number matches
                    if (this._updateBuffer[i].seq == seq) {
                        // Handle and remove update
                        this._handleUpdate(this._updateBuffer[i]);
                        this._updateBuffer.splice(i--, 1);

                        // Mark seq as found
                        found = true;
                    }
                }

                // If no match was found, abort (no longer consecutive)
                if (!found) {
                    break;
                }
            }

            // If this addition made the buffer exceed max size (which also implies buffer had no consecutive updates)
            if (this._updateBuffer.length > this._updateBufferMaxSize) {
                // Set sync status to desynchronized
                this._statusSync = OrderBook.SYNC_STATUS_DESYNCHRONIZED;

                // Emit syncLost event
                this._eventEmitter.emit("syncLost");
            }
        }
    }
};

/*
 * Internal function to handle order book updates. Updates passed to this
 * function must be in order, as it offers no protection against this.
 */
OrderBook.prototype._handleUpdate = function(update) {
    // Store seq for future comparison
    this._lastHandledSeq = update.seq;

    // Handle update by type
    switch (update.updateType) {
    case "orderBookModify":
        // Parse rate and amount to numbers
        var updateRate = parseFloat(update.rate);
        var updateAmount = parseFloat(update.amount);

        // Apply update to appropriate table
        if (update.type == "ask") {
            this._asks.add(new TableEntry(updateRate, updateAmount));
            this._asks.sort(Table.SORT_ASCENDING);
        } else if (update.type == "bid") {
            this._bids.add(new TableEntry(updateRate, updateAmount));
            this._bids.sort(Table.SORT_DESCENDING);
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
    this._calculateMetrics();

    // Emit update event
    this._eventEmitter.emit("update");
};

/*
 * Internal function to calculate metrics.
 */
OrderBook.prototype._calculateMetrics = function() {
    // If neither table is empty
    if (this.getNumAsks() > 0 && this.getNumBids() > 0) {
        // Bid-ask spread (difference between highest bid rate and lowest ask rate)
        this._metrics.spread = this.getAskAt(0).getRate() - this.getBidAt(0).getRate();
    }

    // Copy asks table metrics
    this._metrics.askSumAmount = this._asks.getMetrics().sumAmount;
    this._metrics.askSumTotal = this._asks.getMetrics().sumTotal;

    // Copy bids table metrics
    this._metrics.bidSumAmount = this._bids.getMetrics().sumAmount;
    this._metrics.bidSumTotal = this._bids.getMetrics().sumTotal;
};

/*
 * A bid/ask table with unique, rate-indexed entries.
 */
function Table() {
    this._entries = new Array();
    this._metrics = {
        "sumAmount": 0,
        "sumTotal": 0
    };
}

/*
 * Enums for table sort directions.
 */
Table.SORT_ASCENDING = 1;
Table.SORT_DESCENDING = -1;
Table.SORT_NONE = 0;

/*
 * Get this table's entries.
 */
Table.prototype.getEntries = function() {
    return this._entries;
};

/*
 * Get this table's metrics.
 */
Table.prototype.getMetrics = function() {
    return this._metrics;
};

/*
 * Remove all entries from this table.
 */
Table.prototype.clear = function() {
    // Remove all entries
    this._entries.splice(0, this._entries.length);

    // Update metrics to reflect clear
    this._metrics.sumAmount = 0;
    this._metrics.sumTotal = 0;
};

/*
 * Add (will overwrite existing) an entry to this table.
 */
Table.prototype.add = function(entry) {
    // Update metrics to reflect addition
    this._metrics.sumAmount += entry.getAmount();
    this._metrics.sumTotal += entry.getTotal();

    // Iterate over entries
    for (var i = 0; i < this._entries.length; i++) {
        // If rate matches
        if (this._entries[i].getRate() == entry.getRate()) {
            // Update metrics to reflect replacement
            this._metrics.sumAmount -= this._entries[i].getAmount();
            this._metrics.sumTotal -= this._entries[i].getTotal();

            // Update existing entry
            this._entries[i] = entry;

            return;
        }
    }

    // Otherwise, simply append entry to table
    this._entries.push(entry);
};

/*
 * Remove the entry with the given rate from this table.
 */
Table.prototype.remove = function(rate) {
    // Iterate over entries
    for (var i = 0; i < this._entries.length; i++) {
        // If rate matches
        if (this._entries[i].getRate() == rate) {
            // Update metrics to reflect removal
            this._metrics.sumAmount -= this._entries[i].getAmount();
            this._metrics.sumTotal -= this._entries[i].getTotal();

            // Remove this entry
            this._entries.splice(i, 1);

            break;
        }
    }
};

/*
 * Sort all entries in this table by rate in the given sort direction.
 */
Table.prototype.sort = function(sortDir) {
    // Sort entries by rate according to given direction
    if (sortDir == Table.SORT_ASCENDING) {
        this._entries.sort((a, b) => {
            return a.getRate() - b.getRate();
        });
    } else if (sortDir == Table.SORT_DESCENDING) {
        this._entries.sort((a, b) => {
            return b.getRate() - a.getRate();
        });
    }
};

/*
 * A bid/ask table entry.
 */
function TableEntry(rate, amount) {
    this._rate = rate;
    this._amount = amount;

    // Calculate total (in the same currency as the rate)
    this._total = rate * amount;
}

/*
 * Get rate.
 */
TableEntry.prototype.getRate = function() {
    return this._rate;
};

/*
 * Get amount.
 */
TableEntry.prototype.getAmount = function() {
    return this._amount;
};

/*
 * Get total.
 */
TableEntry.prototype.getTotal = function() {
    return this._total;
};

module.exports = OrderBook;
