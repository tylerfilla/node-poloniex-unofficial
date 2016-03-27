
/*
 *
 * poloniex-unofficial
 *
 * Yet another unofficial wrapper for the Poloniex cryptocurrency exchange APIs
 * on Node.js
 *
 */

// Import modules
var polo = require("./../");

// Get access to the push API
var poloPush = polo.api("push");

// Receive trollbox updates
poloPush.trollbox((err, response) => {
    // Check for error
    if (err) {
        console.log("An error occurred");
        return;
    }
    
    // Log response
    console.log(response);
});

