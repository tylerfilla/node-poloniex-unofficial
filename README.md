node-poloniex-unofficial
========================

Yet another unofficial Node.js wrapper for the [Poloniex cryptocurrency exchange APIs](https://poloniex.com/support/api/). I put a lot of thought into the name, can't you tell?

Just a clarification for others, as I've confused myself more than I care to admit:  
`node-poloniex-unofficial` is the name of the project, repository, and product as a whole  
`poloniex-unofficial` is the name of the Node.js package (a subset thereof)   
`polonode` (as in https://git.io/polonode) is an acceptable alternative to `node-poloniex-unofficial`

Installation
------------

This project is currently in its infancy and is not available directly from npm. There is no stable release, either, at the moment, so the best way to get the code now is straight from `master`, though I recommend using it strictly for evaluation until things mature a bit.

However, npm *will* allow you to clone the GitHub repo and install in one command. Give the following a try.
```
$ npm install tylerfilla/node-poloniex-unofficial
```

This will install `poloniex-unofficial` to your current directory straight from the repo, wherein you can fire up `node` and start tinkering with it immediately.

Usage
-----

All use of the library starts with the `require` statement.
```javascript
var polo = require("poloniex-unofficial");
```

From there, you'll need to pick an API to work with (Poloniex has 3 of them: push, public, and trading).
```javascript
// Get wrapper for the push API
var apiPush = polo.api("push");

// Then for the public API
var apiPublic = polo.api("public");

// And finally the trading API
var apiTrading = polo.api("trading", {
    "apiKey": "MY-POLONIEX-API-KEY",
    "apiSecret": "mypoloniexapisecret"
});
```

### The Push API ###

The push API is by far the fastest and simplest interface to Poloniex, which makes it the most well-suited of the three for fast-paced trading decisions. Its `poloniex-unofficial` wrapper will give you access to trade and order book updates, price tickers, and the infamous trollbox. All of this is delivered to your own code via speedy, real-time WebSocket connections, courtesy of [Autobahn|JS](http://autobahn.ws/js/).

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
    } else {
        // Format and log the chat message
        console.log(response.username + ": " + response.message);
    }
});
```

The above code uses the `trollbox` function to subscribe to the "trollbox" [WAMP](https://en.wikipedia.org/wiki/Web_Application_Messaging_Protocol) feed on `wss://api.poloniex.com/`.

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
    } else {
        // Log the last price and what pair it was for
        console.log(response.currencyPair + ": " + response.last);
    }
});
```

This is using the `ticker` push API wrapper function to stream real-time info like the last price, lowest ask, highest bid, volume, and the 24h high/low for *every* currency listed at Poloniex. Neat, huh?

With a little logic, we can sift through the data and just watch our favorite currencies.

```javascript
// Import the module
var polo = require("poloniex-unofficial");

// Get access to the push API
var apiPush = polo.api("push");

// A list of my favorites
var watchList = ["BTC_ETH", "BTC_MAID", "BTC_QORA"];

// Get price ticker updates
apiPush.ticker((err, response) => {
    if (err) {
        // Log error message
        console.log("An error occurred: " + err.msg);
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

The public API comes in handy when you need to retrieve large chunks of data for analysis. The communication is not as fast, as all data must be explicitly requested, with each request yielding exactly one response. As of writing this document, Poloniex allows a maximum average of three public API calls per second in any one-minute period.

Responses from the public API are given in JSON, so there isn't much the wrapper does other than the actual communication. As a result, much of what the wrapper returns is directly mapped to the responses from the API. I therefore recommend reading [Poloniex's official API docs](https://poloniex.com/support/api/) for any concerns regarding response interpretation.

### The Trading API ###

The trading API

### Some Nifty Stuff ###

The architecture of this library makes for some cool one-liners, too.

TASK: Read the trollbox from the comfort of your own terminal
```
$ node --eval "require('poloniex-unofficial').api('push').trollbox((e, r) => console.log(e ? 'Error: ' + e.msg : r.username + ': ' + r.message))"
```

TASK: Log last prices and pairs to which they belong
```
$ node --eval "require('poloniex-unofficial').api('push').ticker((e, r) => console.log(e ? 'Error: ' + e.msg : new Date() + '\t' + r.currencyPair + ' \t' + r.last))"
```

On a GNU system, the command above can be modified to log to a file, filter for a certain pair, or even both.
```
$ node --eval "..." > last.log
$ node --eval "..." | grep BTC_ETH
$ node --eval "..." | grep --line-buffered BTC_ETH > eth_last.log
```

License
-------

Copyright (c) 2016 Tyler Filla   
This software may be modified and distributed under the terms of [the MIT license](https://opensource.org/licenses/MIT). See the [LICENSE](https://github.com/tylerfilla/node-poloniex-unofficial/blob/master/LICENSE) file for details.

Disclaimer: I just want to be clear about some of the legalese in the LICENSE file (which shall not be superseded by this loose interpretation). By using this software, you acknowledge that any damages incurred, which most probably means financial loss in this context, are not the responsibility of any contributors to the project. While the entire purpose of the project is to enable access to its users' assets according to strict protocol, things can happen. That said, I hope to be able to rely more strongly on this software in the short term.

The `node-poloniex-unofficial` project is not affiliated in any way with Poloniex. It's literally in the name. "Unofficial."
