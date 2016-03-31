node-poloniex-unofficial
========================

Yet another unofficial Node.js wrapper for the Poloniex cryptocurrency exchange APIs. I put a lot of thought into the name, can't you tell?

Installation
------------

This project is currently in its infancy and is currently not available directly from npm. There is no stable release, either, at the moment, so the best route to get the code now is straight from master, though I recommend using it strictly for evaluation, if at all.

Newer versions of npm will allow you to clone a GitHub repo and install a package in one command. Give the following a try.
```
npm install tylerfilla/node-poloniex-unofficial
```

This will install node-poloniex-unofficial to your current directory, wherein you can fire up the REPL and start tinkering with it immediately.

Usage
-----

All use of the library starts with requiring it:
```javascript
var polo = require("poloniex-unofficial");
```

From there, you need to pick an API to connect to (Poloniex has 3 of them, public, push, and trading):
```javascript
var apiPush = polo.api("push");
```

The push API wrapper will give you access to trade and order book updates, price tickers, and the infamous trollbox. All of this is delivered to your own code via speedy, real-time WebSocket connections, courtesy of Autobahn|JS.

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
```

Forfeiting all error-handling ability, check this out:
```javascript
apiPush.trollbox((err, response) => console.log(response.username + ": " + response.message));
```

If you don't mind a little JSON around the edges, the above can even be condensed down to this:
```javascript
apiPush.trollbox(console.log);
```

Hopefully this comes in handy for someone!

License
-------

MIT License

Copyright (c) 2016 Tyler Filla

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
