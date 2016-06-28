node-poloniex-unofficial
========================

[![npm version](https://badge.fury.io/js/poloniex-unofficial.svg)](https://badge.fury.io/js/poloniex-unofficial)
[![Build Status](https://travis-ci.org/tylerfilla/node-poloniex-unofficial.svg?branch=master)](https://travis-ci.org/tylerfilla/node-poloniex-unofficial)
[![Dependency Status](https://david-dm.org/tylerfilla/node-poloniex-unofficial.svg)](https://david-dm.org/tylerfilla/node-poloniex-unofficial)

Yet another unofficial Node.js wrapper for the Poloniex cryptocurrency exchange APIs.

Just a clarification for others, as I've confused myself more than I care to admit:  
`node-poloniex-unofficial` is the name of the project, repository, and product as a whole.  
`poloniex-unofficial` is the name of the Node.js package (a subset thereof).  
`polonode` (as in https://git.io/polonode) is an acceptable alternative to `node-poloniex-unofficial`.

Installation
------------

This project is available on npm. Just run the following and be on your merry way.

```sh
$ npm install poloniex-unofficial
```

Usage
-----

All use of the library starts by requiring it.

```js
var polo = require("poloniex-unofficial");
```

From there, you'll need to pick an API to work with. Poloniex has three of them: push, public, and trading.

### The Push API ###

The push API is by far the fastest and simplest interface to Poloniex, which makes it the most well-suited of the three for making fast-paced trading decisions. Its `poloniex-unofficial` wrapper will give you access to trade and order book updates, price tickers, and the infamous trollbox. All of this is delivered to your own code via speedy, real-time WebSocket connections, courtesy of [Autobahn|JS](http://autobahn.ws/js/).

Take this one out for a spin:

```js
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var poloPush = new polo.PushWrapper();

// Receive trollbox updates
poloPush.trollbox((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Disconnect
        return true;
    }

    // Log chat message as "[rep] username: message"
    console.log("    [" + response.reputation + "] " + response.username + ": " + response.message);
});
```

The above code uses the `trollbox` function to subscribe to the "trollbox" [WAMP](https://en.wikipedia.org/wiki/Web_Application_Messaging_Protocol) feed at `wss://api.poloniex.com/`.

Notice the `return true;` line. Returning true from a push API wrapper callback indicates that you no longer wish to receive updates from that feed, and the callback will cease to be called. Internally, it leads Autobahn|JS to unsubscribe from that WAMP feed. The entire API connection, associated with the wrapper instance, will remain open as long as there is at least one active subscription (at least one wrapper function, such as `trollbox()`, receiving data) at any given time. Once the final subscription terminates, the API connection will be closed. The connection can and will be transparently reestablished the moment another feed is requested on the same wrapper instance, but this shutdown behavior both saves resources and allows your program to gracefully exit.

Arguably more important is the money-related stuff. The following script will log the prices of each currency pair traded at Poloniex.

```js
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var poloPush = new polo.PushWrapper();

// Receive ticker updates
poloPush.ticker((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Disconnect
        return true;
    }

    // Log raw response
    console.log(response);
});
```

This is using the `ticker` push API wrapper function to stream real-time info like the last price, lowest ask, highest bid, volume, and the 24h high/low for every listed currency pair.

With a little logic, we can sift through the data and just watch our favorite currencies.

```js
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var poloPush = new polo.PushWrapper();

// Some currency pairs to watch
var watchList = ["BTC_ETH", "BTC_XMR"];

// Get price ticker updates
poloPush.ticker((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Disconnect
        return true;
    }

    // Check if this currency is in the watch list
    if (watchList.indexOf(response.currencyPair) > -1) {
        // Log the currency pair and its last price
        console.log(response.currencyPair + ": " + response.last);
    }
});
```

### The Public API ###

The public API comes in handy when you need to retrieve large chunks of data for analysis, or when setting up a baseline before switching to the push API in a trading bot, for instance. The communication is not as fast, as all data must be explicitly requested, with each request yielding exactly one response. As of writing this document, Poloniex allows a maximum average of three public API calls per second in any one-minute period.

Poloniex's responses from the public API are provided in JSON, so there isn't much the wrapper needs to do other than handle communication. I therefore recommend reading Poloniex's official [API docs](https://poloniex.com/support/api/) for information on how to interpret the responses.

Each function provided by the public API wrapper corresponds to exactly one command available via the public API. An effort was made to name the wrapper functions after their associated commands, but this pattern cannot be guaranteed for any commands Poloniex may add in the future.

```js
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the public API
var poloPublic = new polo.PublicWrapper();

// Return a list of currencies supported by Poloniex
poloPublic.returnCurrencies((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);
    } else {
        // Log response
        console.log(response);
    }
});
```

The above code demonstrates the wrapper function for the Poloniex `returnCurrencies` command, which provides a set of all currencies supported by the exchange, as well as specific properties of each.

Read more about the various commands offered in the official [API docs](https://poloniex.com/support/api/).

### The Trading API ###

The trading API is nearly identical in operation to the public API, with authentication being the real difference. This library aims to make authenticating as painless as possible. Your Poloniex API key and secret simply need to be  passed in as parameters to the trading wrapper constructor when instantiating it, as in the following snippet:

```js
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the trading API
var poloTrading = new polo.TradingWrapper("key", "secret");

// Do some trading
```

Worth noting is the fact that Poloniex requires that a unique and ever-increasing [nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) value be included to prevent an attacker from capturing and/or reusing encrypted traffic containing your credentials. By default, the millisecond-precision UNIX Epoch time provided by `Date.now()` is used, as it is inherently ever-increasing and is granular enough for the purposes of this library.

Poloniex stores your latest and greatest nonce value and compares it to each nonce provided by successive trading commands. As a result, it is possible to have incremented your nonce value too far to simply use UNIX time (at least not any time soon). To counter this, you may supply your own function to the trading wrapper constructor as an optional third parameter to outsource nonce generation, like so:

```js
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the trading API
var poloTrading = new polo.TradingWrapper("key", "secret", function() {
    // Tack on a few orders of magnitude (Warning: Don't do this unless you need to!)
    return Date.now() * 1000;
});

// Do some trading
```

My recommendation: If you do not need this feature, don't use it. Using the snippet above and executing a trading command will permanently increment Poloniex's expected future nonce and you won't be able to stop using it. This may or may not be negotiable with Poloniex support, but that seems to me like an excellent social engineering opportunity.

Read about the various commands offered in the official [API docs](https://poloniex.com/support/api/).

License
-------

Copyright (c) 2016 Tyler Filla   
This software may be modified and distributed under the terms of [the MIT license](https://opensource.org/licenses/MIT). See the [LICENSE](https://github.com/tylerfilla/node-poloniex-unofficial/blob/master/LICENSE) file for details.

The `node-poloniex-unofficial` project is not affiliated in any way with Poloniex. It's literally in the name. "Unofficial."

Support the Project
-------------------

The best way to build the most useful product for the many is to combine the efforts of the many. This project welcomes contributions of all kinds, whether in Coke or code. Feel free to open a PR or send some BTC to 12xZkQkb7b3ttXNGf2PRmdKje83o4Rx5R8. Either would be tremendously appreciated! [/shameless plea for soft drinks]
