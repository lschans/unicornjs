var config = require('../config.json'),
    repl = require('repl'),
    net = require('net');

// Load npm in the config, this can be useful
config.npm = require('../package.json');

// Load the repl shell
var replShell = require('./repl-shell.js')(config,repl, net);

replShell.start();

