/*************************************************
 Template for a master process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/

var busTalk = require('unicorn/bus-talk');

module.exports = function(config, redis, unicorn) {
    return {
        startLogic: function () {
            /*
             * This function will start when the master process starts
             * this code will be executed once on the start of the master process.
             */
            var colors = require('colors');
            // Log the output for demo purposes
            console.log(colors.cyan('Hey math started'));

        },
        workLogic: function (message) {
            /*
             * This function contains the master logic, it's also the end of the chain.
             * Message is the processed and final version, usually this is the message that is posted to the response channel
             * A normal action to do would be to post this message back to the response channel
             */
            var colors = require('colors');
            // Log the output for demo purposes
            var msg = JSON.parse(message);

            console.log('MATH RECEIVE A MSG !');

            unicorn.busTalk.sendAnswer('math', msg.respondChannel, msg.function,  msg.data, process.pid, config).then(function (result) {
                console.log('MATH send the answer %s', result);
            });
            console.log(colors.cyan(message));
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