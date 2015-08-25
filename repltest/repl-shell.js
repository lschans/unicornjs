var through2 = require('through2'),
    StringDecoder = require('string_decoder').StringDecoder,
    Stream = require('stream'),
    commandList = [], // List with available commands
    commandDesc = [], // List with command descriptions
    commands = {}; // Object with commands added to the scope

// TODO: Add cd command, switch to normal repl mode

function shellIn(chunk, enc, callback) {
    var decoder = new StringDecoder('utf8');
    // Get clean command from stdin so we can use this and do magic with it.
    var command = decoder.write(chunk).replace(/^\s+|\s+$/g, '').split(" ");

    var commandAllowed = commandList.indexOf(command[0]);
    if (~commandAllowed) {
        // transform the command + a newline to a utf8 buffer and send it with arguments to repl
        this.push(new Buffer(commands[command.shift()].apply(this, command) + "\n", 'utf8'));
    } else {
        console.log("Syntax Error!");
        // Push empty line
        this.push(new Buffer("\n", 'utf8'));
    }

    callback();
}

function shellOut(chunk, enc, callback) {
    var decoder = new StringDecoder('utf8');
    // Get clean command from stdin so we can use this and do magic with it.
    var output = decoder.write(chunk).replace(/^\s+|\s+$/g, '');

    // Remove nodejs undefined from output
    if(output == 'undefined') output = '';

    // Write output to stdout our self
    process.stdout.write(new Buffer(output, 'utf8'));

    callback();
}

function replShell(config, repl, net) {
    var prompt = 'unicorn> ',
        welcomeMsg = 'Welcome to the unicorn shell (v' + config.npm.version + ')';

    function addCommand(command, desc, func) {
        commands[command] = func;
        commandDesc.push(desc);
        commandList.push(command);
    }

    var shellFunctions = {
        exit:function () {
            console.log('Bye bye');
            process.exit(0);
        },
        clear:function () {
            return process.stdout.write('\033c');
        },
        ls:function() {
            for (var key in commandList){
                // Iterates over the commands, as everyone expects.
                process.stdout.write(commandList[key] + "\t" + commandDesc[key] + "\n");
            }
            return true;
        },
        echo:function() {
            return process.stdout.write(Array.prototype.slice.call(arguments).join(' ') + "\n");
        }
    };

    // Add some default functions that are always available
    addCommand('exit', 'Close the application',shellFunctions.exit);
    addCommand('clear', 'Clear the terminal screen',shellFunctions.clear);
    addCommand('ls', 'List all available commands',shellFunctions.ls);
    addCommand('echo', 'Print a string',shellFunctions.echo);

    return {
        start:function() {
            console.log(welcomeMsg);

            // Start a repl as a runtime prompt
            repl.start({
                prompt: prompt,
                input: process.stdin.pipe(through2({ objectMode: true, allowHalfOpen: true }, shellIn)),
                output: new Stream().pipe(through2({ objectMode: false, allowHalfOpen: false }, shellOut)),
                terminal: true,
                useGlobal: false,
                useColors: true
            });
        }
    }
}

module.exports = replShell;