/*************************************************
 Template for a master process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/

var busTalk = require('unicorn/bus-talk');

// Returns a random integer between min and max

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(config, redis, msgHook) {
    return {
        startLogic: function () {
            /*
             * This function will start when the master process starts
             * this code will be executed once on the start of the master process.
             */
            // Log the output for demo purposes
            console.log(('Hey lars-test started'));

            if(typeof(msgHook) == 'function') {
                // Dummy interval for sending messages on the bus
                setInterval(function(){ // Test that will publish stuff
                    msgHook({"test":"test message!!"});
                    var extraJobs = Boolean(Math.floor(Math.random() * 2));

                    if(extraJobs) {
                        for(var i = 0; i <= getRandomInt(5, 25); i++) {
                            setTimeout(function () {
                                msgHook({"test": "test message!!"});
                            }, getRandomInt(10, 1500));
                        }
                    }

                }, 2000);
            }
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