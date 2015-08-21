/*
 Sample project using the `unicorn micro-service infrastructure`.
 */

//var config = xtend(defaultConfig, config),
// xtend = require('xtend'),


var config = require('./config.json'),
    Program = require('commander'),
    Redis = require('redis');

// Load npm in the config, this can be useful
config.npm = require('./package.json');

// Set the rootdir of the project in the config, the structure relies on this value.
config.rootdir = __dirname;

Program
    .version(config.npm.version)
    .option('-d, --debug', 'Run in debug mode')
    .option('-r, --run', 'Run unicorn')
    .option('-s, --spawn [value]', 'Spawn a service, don\'t use this if you don\'t know what you are doing (The value is the key from the config)')
    .parse(process.argv);

// Detect debug mode and set
if (Program.debug) {
    console.log('Debug mode enabled');
    config.debug = true;
}

// Detect repl mode and set
if (Program.repl) {
    var Repl = require("repl");
}

// Detect spawn mode and set
if (Program.spawn) { // Spawn a process
    // Tell the process here which one to start
    console.log(Program.spawn);
    // Clean up and check for integer and existance in future
    config.process = config.services[Program.spawn];
    var thisProcess = require('unicorn/redis-mthread')(config, Redis);
}

// Run all the services
if (Program.run){
    // Load the service spawner so we can spawn all services from the config
    var serviceSpawner = require('unicorn/service-spawner')(config, Redis);
}

