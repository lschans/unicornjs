/*************************************************
 Template for a worker process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/

var busTalk = require('unicorn/bus-talk');

module.exports = function(config, redis) {
    return {
        startLogic: function () {
            /*
             * This function will start when the worker process starts
             * this code will be executed once on the start of a worker.
             */

            // No code needed for this demo
        },
        workLogic: function (message, callback) {
            /*
             * This function contains the worker logic.
             * The raw message comes in and should be processed.
             * When done processing; the callback message must be called in normal (err, message) format.
             */


            console.log(message);
            var msg = JSON.parse(message);

            console.log('MATH RECEIVE A MSG !');

            busTalk.sendAnswer('math', msg.respondChannel, msg.function,  msg.data, process.pid, config).then(function (result) {
                console.log('MATH send the answer %s', result);
            });
            //functionName.apply(null, data);
            //
            //console.log('Math working here please dont bother');
            //
            //function printMessage(string){
            //    console.log('apply function %s to %s', functionName, data);
            //}

            callback(null, message);
        }
    }
};