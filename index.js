/*
 Sample project using the `unicorn micro-service infrastructure`.
 */

var config = require('./config.json'),
    Program = require('commander'),
    Spawn = require('child_process').spawn,
    Repl = require("repl"),
    Redis = require('redis');

// Set the rootdir of the project in the config, the structure relies on this value.
config.rootdir = __dirname;

//var demoService = require('unicorn/redis-mthread')(config, Redis, './unicorn_services/demo-service/master.js', './unicorn_services/demo-service/worker.js');

var mathService = require('unicorn/redis-mthread')(config, Redis, './unicorn_services/demo-service/master.js', './unicorn_services/demo-service/worker.js');
