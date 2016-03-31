node-poloniex-unofficial
========================

Yet another unofficial Node.js wrapper for the Poloniex cryptocurrency exchange APIs. I put a lot of thought into the name, can't you tell?

Just a clarification for others, as I've confused myself more than I care to admit:  
`node-poloniex-unofficial` is the name of the project, repository, and product as a whole  
`poloniex-unofficial` is the name of the Node.js package (a subset thereof)   
`polonode` (as in https://git.io/polonode) is an acceptable alternative to `node-poloniex-unofficial`

Installation
------------

This project is currently in its infancy and is not available directly from npm. There is no stable release, either, at the moment, so the best way to get the code now is straight from `master`, though I recommend using it strictly for evaluation until things mature a bit.

However, npm will allow you to clone a GitHub repo and install a package in one command. Give the following a try.
```
npm install tylerfilla/node-poloniex-unofficial
```

This will install `poloniex-unofficial` to your current directory straight from the repo, wherein you can fire up the REPL and start tinkering with it immediately.

Usage
-----

All use of the library starts with requiring it.
```javascript
var polo = require("poloniex-unofficial");
```

From there, you'll need to pick an API to work with (Poloniex has 3 of them: public, push, and trading).
```javascript
// Get the wrapper for the public API (provides generic, two-way queries of data)
var apiPublic = polo.api("public");

// Then get the wrapper for the push API (provides fast, one-way streams of data)
var apiPush = polo.api("push");

// And then the trading API (provides a two-way interface to your account; you'll need your API key and secret for this)
var apiTrading = polo.api("trading", {
    "apiKey": "MY-POLONIEX-API-KEY",
    "apiSecret": "mypoloniexapisecret"
});
```

The push API is by far the fastest and simplest interface to Poloniex. Its `poloniex-unofficial` wrapper will give you access to trade and order book updates, price tickers, and the infamous trollbox. All of this is delivered to your own code via speedy, real-time WebSocket connections, courtesy of [Autobahn|JS](http://autobahn.ws/js/).

Take this one for a spin:
```javascript
// With boring functions
apiPush.trollbox(function(err, response) {
    // Check for any errors
    if (err) {
        // Do not attempt to handle them whatsoever and just die
        return;
    }
    
    // Format the chat message
    console.log(response.username + ": " + response.message);
});

// With arrow (AKA awesome) functions
apiPush.trollbox((err, response) => {
    if (err) {
        return;
    }
    
    console.log(response.username + ": " + response.message);
});

// Forfeiting all error-handling ability
apiPush.trollbox((err, response) => console.log(response.username + ": " + response.message));

// If you don't mind a little JSON around the edges, the above can even be condensed down to this
apiPush.trollbox(console.log);
```

There's still much to do. Hopefully this comes in handy for someone!

License
-------

Copyright (c) 2016 Tyler Filla   
This software may be modified and distributed under the terms of the MIT license. See the LICENSE file for details.

Disclaimer: I just want to be clear about some of the legalese in the LICENSE file (which this notice shall not supersede). By using this software, you acknowledge that any damages incurred, which most probably means financial loss in this context, are not the responsibility of any contributors to the project. While the entire purpose of the project is to enable programmatic access its users' assets according to strict protocol, we all know how things can happen. That said, I hope to be able to rely on this software in the short term.

The `node-poloniex-unofficial` project is not affiliated in any way with Poloniex. It's literally in the name. "Unofficial."
