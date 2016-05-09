node-poloniex-unofficial
========================

Yet another unofficial Node.js wrapper for the Poloniex cryptocurrency exchange APIs. I put a lot of thought into the name, can't you tell?

[![NPM](https://nodei.co/npm/poloniex-unofficial.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/poloniex-unofficial/)

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

All use of the library starts with the `require` statement.

```javascript
var polo = require("poloniex-unofficial");
```

From there, you'll need to pick an API to work with. Poloniex has three of them: push, public, and trading.

### The Push API ###

The push API is by far the fastest and simplest interface to Poloniex, which makes it the most well-suited of the three for making fast-paced trading decisions. Its `poloniex-unofficial` wrapper will give you access to trade and order book updates, price tickers, and the infamous trollbox. All of this is delivered to your own code via speedy, real-time WebSocket connections, courtesy of [Autobahn|JS](http://autobahn.ws/js/).

Take this one out for a spin:

```javascript
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var apiPush = polo.api("push");

// Now let's watch the mayhem of the trollbox from a safe distance
apiPush.trollbox((err, response) => {
    // Check for any errors
    if (err) {
        // Log the error message
        console.log("An error occurred: " + err.msg);

        // Send kill signal
        return true;
    } else {
        // Format and log the chat message
        console.log(response.username + ": " + response.message);
    }
});
```

The above code uses the `trollbox` function to subscribe to the "trollbox" [WAMP](https://en.wikipedia.org/wiki/Web_Application_Messaging_Protocol) feed on `wss://api.poloniex.com/`.

Notice the `return true;` on line 15. Returning true from a push API wrapper function callback function (try saying that three times fast) indicates that you no longer wish to receive updates from the respective feed, internally prompting Autobahn|JS to unsubscribe from the respective WAMP feed. The API connection will be maintained by the library as long as there is at least one active subscription (at least one wrapper function receiving data) at any given time. Once the final subscription terminates, the API connection will be closed. The connection can and will be transparently reestablished the moment another feed is requested, but this behavior both saves resources and allows your program to gracefully exit.

Arguably more important is the, you know, money-related stuff. The following snippet will monitor the prices of each currency and log them.

```javascript
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var apiPush = polo.api("push");

// Get price ticker updates
apiPush.ticker((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Send kill signal
        return true;
    } else {
        // Log the last price and what pair it was for
        console.log(response.currencyPair + ": " + response.last);
    }
});
```

This is using the `ticker` push API wrapper function to stream real-time info like the last price, lowest ask, highest bid, volume, and the 24h high/low for *every* currency pair listed at Poloniex. Neat, huh?

With a little logic, we can sift through the data and just watch our favorite currencies.

```javascript
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var apiPush = polo.api("push");

// Some of my favorites
var watchList = ["BTC_ETH", "BTC_MAID", "BTC_QORA"];

// Get price ticker updates
apiPush.ticker((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);

        // Send kill signal
        return true;
    } else {
        // Check if this currency is interesting
        if (watchList.indexOf(response.currencyPair) > -1) {
            // Log the last price and what pair it was for
            console.log(response.currencyPair + ": " + response.last);
        }
    }
});
```

### The Public API ###

The public API comes in handy when you need to retrieve large chunks of data for analysis, or when setting up a baseline before switching to the push API in a trading bot, for instance. The communication is not as fast, as all data must be explicitly requested, with each request yielding exactly one response. As of writing this document, Poloniex allows a maximum average of three public API calls per second in any one-minute period.

Poloniex's responses from the public API are provided in JSON, so there isn't much the wrapper needs to do other than handle communication. I therefore recommend reading Poloniex's official [API docs](https://poloniex.com/support/api/) for information on how to interpret the responses.

Each function provided by the public API wrapper corresponds to exactly one command available via the public API. An effort was made to name the wrapper functions after their associated commands, but this pattern cannot be guaranteed for any commands Poloniex may add in the future.

```javascript
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the public API
var apiPublic = polo.api("public");

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

The trading API is nearly identical in operation to the public API, with authentication being the real difference. This library aims to make authenticating as painless as possible. When using the selector function to access the trading API wrapper, your Poloniex API key and secret simply need to be bundled into an object and passed in alongside the module name, as in the following snippet.

```javascript
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the trading API
var apiTrading = polo.api("trading", {
    "key": "MY-POLONIEX-API-KEY",
    "secret": "mypoloniexapisecret"
});

// TODO: Do stuff with it here
```

I do not recommend hard-coding your API key and/or secret into your scripts, simply on general security principle. I, personally, recommend providing this info on-demand to your scripts via a user interface or, at the very least, through command-line arguments (which will probably be logged someplace, anyway).

Read about the various commands offered in the official [API docs](https://poloniex.com/support/api/).

### Some Nifty Stuff ###

The architecture of this library (particularly for the push API wrapper) makes for some cool one-liners, too.

Read the trollbox from the comfort of your own terminal.

```sh
$ node --eval "require('poloniex-unofficial').api('push').trollbox((e, r) => console.log(e ? 'Error: ' + e.msg : r.username + ': ' + r.message))"
```

Log any price changes in the supported currencies.

```sh
$ node --eval "require('poloniex-unofficial').api('push').ticker((e, r) => console.log(e ? 'Error: ' + e.msg : new Date() + '\t' + r.currencyPair + ' \t' + r.last))"
```

On a GNU system, the command above can be modified to log to a file, filter for a certain currency pair, or even both.

```sh
$ node --eval "..." > last.log
$ node --eval "..." | grep BTC_ETH
$ node --eval "..." | grep --line-buffered BTC_ETH > eth_last.log
$ echo "Yes, I may have cheated with the ellipses. Meh"
```

License
-------

Copyright (c) 2016 Tyler Filla   
This software may be modified and distributed under the terms of [the MIT license](https://opensource.org/licenses/MIT). See the [LICENSE](https://github.com/tylerfilla/node-poloniex-unofficial/blob/master/LICENSE) file for details.

Disclaimer: I just want to be clear about some of the legalese in the LICENSE file (which shall not be superseded by this loose interpretation). By using this software, you acknowledge that any damages incurred, which most probably means financial loss in this context, are not the responsibility of any contributors to the project. While the entire purpose of the project is to enable access to its users' assets according to strict protocol, things can happen.

The `node-poloniex-unofficial` project is not affiliated in any way with Poloniex. It's literally in the name. "Unofficial."
