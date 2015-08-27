/*************************************************
 Template for a master process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/

var repl = require('repl'),
    net = require('net'),
    through2 = require('through2'),
    StringDecoder = require('string_decoder').StringDecoder,
    Stream = require('stream');

module.exports = function(config, redis) {
    var sockfile = "/tmp/node-repl-sock",
        commandList = [], // List with available commands
        commandDesc = [], // List with command descriptions
        commands = {}, // Object with commands added to the scope
        prompt = 'unicorn> ',
        welcomeMsg = 'Welcome to the unicorn shell (v' + config.npm.version + ')';

    return {
        startLogic: function () {
            /*
             * This function will start when the master process starts
             * this code will be executed once on the start of the master process.
             */

            // TODO: Add cd command, switch to normal repl mode, welcome message, telnet mode with --shell flag
            // TODO: Remove ugly error on undefined commands

            function makeShellin(replInputStream) {

                return through2({ objectMode: true, allowHalfOpen: true }, shellIn);

                function shellIn(chunk, enc, callback) {
                    //console.log("Receive chunk " + chunk);

                    var decoder = new StringDecoder('utf8');
                    // Get clean command from stdin so we can use this and do magic with it.
                    var command = decoder.write(chunk).replace(/^\s+|\s+$/g, '').split(" ");

                    var commandAllowed = commandList.indexOf(command[0]);
                    if (~commandAllowed) {
                        // transform the command + a newline to a utf8 buffer and send it with arguments to repl

                        var runCommand = command.shift();
                        var result = commands[runCommand].apply(this, command);

                        // wij gaan afhandelen.

                        //console.log("Result " + result);

                        this.push(result);
                        this.push("\n");
                        this.push(prompt);

                    } else {
                        // het is een standaard repl commando.

                        replInputStream.write(chunk);
                    }

                    callback();
                }
            }

            function shellOut(chunk, enc, callback) {
                var decoder = new StringDecoder('utf8');
                // Get clean command from stdin so we can use this and do magic with it.
                var output = decoder.write(chunk).replace(/^\s+|\s+$/g, '');

                // Remove nodejs undefined from output
                if(output == 'undefined') output = '';

                this.write(output);

                callback();
            }

            function addCommand(command, desc, func) {
                commands[command] = func;
                commandDesc.push(desc);
                commandList.push(command);
            }

            var shellFunctions = {
                exit: function () {
                    console.log('Bye bye');
                    process.exit(0);
                },
                clear: function () {
                    return '\033c';
                },
                ls: function () {
                    var tmp = "";
                    for (var key in commandList) {
                        // Iterates over the commands, as everyone expects.
                        tmp += commandList[key] + "\t" + commandDesc[key] + "\n";
                    }
                    return tmp;
                },
                echo: function () {
                    return Array.prototype.slice.call(arguments).join(' ');
                }
            };

            // Add some default functions that are always available
            addCommand('exit', 'Close the application', shellFunctions.exit);
            addCommand('clear', 'Clear the terminal screen', shellFunctions.clear);
            addCommand('ls', 'List all available commands', shellFunctions.ls);
            addCommand('echo', 'Print a string', shellFunctions.echo);

            // Remove socket file to prevent crashes on startup
            var fs = require('fs');
            if (fs.existsSync(sockfile)) {
                fs.unlinkSync(sockfile);
            }

            var replInput = through2();

            var connections = 0;
            net.createServer(function (socket) {
                connections += 1;

                var replInput = through2();

                socket.write(prompt);

                repl.start({
                    prompt: prompt,
                    input: replInput,
                    output: socket,
                    terminal: true,
                    useGlobal: false,
                    useColors: true
                });

                socket.pipe(makeShellin(replInput)).pipe(socket);

            }).listen(sockfile);
        },
        workLogic: function (message) {
            /*
             * This function contains the master logic, it's also the end of the chain.
             * Message is the processed and final version, usually this is the message that is posted to the response channel
             * A normal action to do would be to post this message back to the response channel
             */

            // Log the output for demo purposes
            console.log(message);
        },
        errorLogic: function (err) {
            /*
             * This function handles the error messages from the master.
             * A normal action would be to respond with an error on the response channel
             */

            // Log the output for demo purposes
            console.log(err);
        }
    }
};