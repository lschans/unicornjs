/*************************************************
 Template for a worker process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/

// Returns a random integer between min and max

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function doSomethingOnStart(config) {
    config.lars = 'awesome';
    return config;
}

module.exports = function(config, redis) {
    return {
        startLogic: function () {
            /*
             * This function will start when the worker process starts
             * this code will be executed once on the start of a worker.
             */

            // No code needed for this demo

            config = doSomethingOnStart(config);
        },
        workLogic: function (message, callback) {

            message.msg.test += "...Worker handled! " + config.lars;;

            // For demo sleep a while
            setTimeout(function(callback, message){
                callback(message);
            },getRandomInt(500, 3000),callback, message);

            /*
             * This function contains the worker logic.
             * The raw message comes in and should be processed.
             * When done processing; the callback message must be called in normal (err, message) format.
             */

            // Random boolean for testing purposes, if true the service will crash
            //demo is asking for a math job


            //var willDie = Boolean(Math.floor(Math.random() * 2));
            // Craft a new message for testing (Since the type of the raw message is string, we will also respond with a string)
            //var newMessage = message + '_handled-by:' + process.pid + '_will-crash:' + willDie;
            // Send the processed message back to the master
            //callback(null, newMessage);
            // Make the app crash if true, this will produce an ungracefull exit... Just for testing
            //if(willDie) process.exit(1);
        }
    }
};