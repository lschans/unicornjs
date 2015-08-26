var through2 = require('through2'),
    StringDecoder = require('string_decoder').StringDecoder,
    Stream = require('stream'),
    sockfile = "/tmp/node-repl-sock",
    commandList = [], // List with available commands
    commandDesc = [], // List with command descriptions
    commands = {}; // Object with commands added to the scope

// TODO: Add cd command, switch to normal repl mode

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
            this.push("unicorn> ");

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

    // Write output to stdout our self
    //process.stdout.write(new Buffer(output, 'utf8'));

    console.log("ShellOut " + output);

    this.write(output);


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
            return '\033c';
        },
        ls:function() {
            var tmp ="";
            for (var key in commandList){
                // Iterates over the commands, as everyone expects.
                tmp += commandList[key] + "\t" + commandDesc[key] + "\n";
            }
            return tmp;
        },
        echo:function() {
            return Array.prototype.slice.call(arguments).join(' ');
        }
    };

    // Add some default functions that are always available
    addCommand('exit', 'Close the application',shellFunctions.exit);
    addCommand('clear', 'Clear the terminal screen',shellFunctions.clear);
    addCommand('ls', 'List all available commands',shellFunctions.ls);
    addCommand('echo', 'Print a string',shellFunctions.echo);

    return {
        start:function() {
            // Remove socket file to prevent crashes on startup
            var fs = require('fs');
            if (fs.existsSync(sockfile)) {
                fs.unlinkSync(sockfile);
            }

            console.log(welcomeMsg);


            var replInput = through2();

            //process.stdin.pipe(shellIn));

            /*
            process.stdin.pipe(makeShellin(replInput)).pipe(process.stdout);




            // Start a repl as a runtime prompt
            repl.start({
                prompt: prompt,
                //input: process.stdin.pipe(),
                input: replInput,
                //output: new Stream().pipe(through2({ objectMode: false, allowHalfOpen: false }, shellOut)).pipe(process.stdout),
                output: process.stdout,
                terminal: true,
                useGlobal: false,
                useColors: true
            });
            */
            var connections = 0;
            net.createServer(function (socket) {
                connections += 1;

                var replInput = through2();

                socket.write('Fuck you>');


                repl.start({
                    prompt: prompt,
                    //input: process.stdin.pipe(),
                    input: replInput,
                    //output: new Stream().pipe(through2({ objectMode: false, allowHalfOpen: false }, shellOut)).pipe(process.stdout),
                    output: socket,
                    terminal: true,
                    useGlobal: false,
                    useColors: true
                });

                socket.pipe(makeShellin(replInput)).pipe(socket);

                /*

                var socket1 = socket.pipe(through2({ objectMode: true, allowHalfOpen: true }, shellIn));

                var socket2 = new Stream().pipe(through2({ objectMode: false, allowHalfOpen: false }, shellOut)).pipe(socket);



                var inputSocket = socket.pipe(through2({ objectMode: true, allowHalfOpen: true }, shellIn));
                var outputSocket = inputSocket.pipe(through2({ objectMode: false, allowHalfOpen: false }, shellOut)).pipe(socket);

                repl.start({
                    prompt: prompt,
                    input: inputSocket,
                    output: outputSocket,
                }).on('exit', function() {
                    socket.end();
                })
                */
            }).listen(sockfile);
        }
    }
}

module.exports = replShell;