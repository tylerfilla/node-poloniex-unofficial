#!/usr/bin/env node
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

"use strict";

// Import third-party modules
const child_process = require("child_process");

// List of test commands to run
const TEST_COMMANDS = [
    "eslint .",
    "mocha --require test/setup"
];

// Iterate over each command sequentially
for (let i = 0; i < TEST_COMMANDS.length; i++) {
    // Get command test
    let cmd = TEST_COMMANDS[i];

    // Command lead-in
    console.log(`Running command ${i + 1} of ${TEST_COMMANDS.length}`);
    console.log(`>> ${cmd}`);

    // Try to run command
    try {
        // Execute command and inherit all STDIO from this script
        child_process.execSync(cmd, {stdio: "inherit"});
    } catch (e) {
        // Indicate error
        console.error(`Failed with error code ${e.status}`);
        console.error(`Skipping ${TEST_COMMANDS.length - i - 1} remaining test(s)`);

        // Exit with error
        process.exit(1);
    }

    // Give next command some room, if necessary
    if (i < TEST_COMMANDS.length - 1) {
        console.log();
    }
}
