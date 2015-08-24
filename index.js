/*
 Sample project using the `unicorn micro-service infrastructure`.
 */

//var config = xtend(defaultConfig, config),
// xtend = require('xtend'),


var config = require('./config.json'),
    Program = require('commander'),
    Redis = require('redis'),
    Repl = require("repl"),
    Net = require('net');

// Load npm in the config, this can be useful
config.npm = require('./package.json');

// Set the rootdir of the project in the config, the structure relies on this value.
config.rootdir = __dirname;

Program
    .version(config.npm.version)
    .option('-d, --debug', 'Run in debug mode')
    .option('-R, --repl', 'Run repl shell')
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
    console.log('repl mode');
    var sock = Net.createConnection(13131);

    process.stdin.pipe(sock);
    sock.pipe(process.stdout);

    sock.on('connect', function () {
        process.stdin.resume();
        process.stdin.setRawMode(true)
    });

    sock.on('exit', function () {
        console.log('Got "exit" event from repl!');
        process.exit();
    });

    sock.on('close', function done () {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        sock.removeListener('close', done);
    });

    process.stdin.on('end', function () {
        sock.destroy();
        console.log();
    });

    process.stdin.on('data', function (b) {
        if (b.length === 1 && b[0] === 4) {
            process.stdin.emit('end');
        }
    });
}

// Detect spawn mode and set
if (Program.spawn) { // Spawn a process
    // Clean up and check for integer and existance in future
    config.process = config.services[Program.spawn];
    var thisProcess = require('unicorn/redis-mthread')(config, Redis);
}

// Run all the services
if (Program.run){
    // Load the service spawner so we can spawn all services from the config
    var serviceSpawner = require('unicorn/service-spawner')(config);

    // Start a repl
    Net.createServer(function (socket) {
        var r = Repl.start({
            prompt: 'unicorn> '
            , input: socket
            , output: socket
            , terminal: true
            , useGlobal: false
        });

        r.on('exit', function () {
            socket.end()
        })

        r.context.socket = socket
        r.context.exit = function () {
            console.log('Process stoped by repl user');
            process.exit();
        }

    }).listen(13131)
}