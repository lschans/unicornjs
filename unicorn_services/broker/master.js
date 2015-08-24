/*************************************************
 Template for a master process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/


module.exports = function(config, redis) {
    return {
        startLogic: function () {
            /*
             * This function will start when the master process starts
             * this code will be executed once on the start of the master process.
             */

            //config.initChannel = 'broker-init';
            //// Dummy interval for sending messages on the bus
            //setInterval(function(){ // Test that will publish stuff
            //    publishClient.publish(config.redis.channel, 'This is a test message');
            //}, 2000);
        },
        workLogic: function (message) {
            /*
             * This function contains the master logic, it's also the end of the chain.
             * Message is the processed and final version, usually this is the message that is posted to the response channel
             * A normal action to do would be to post this message back to the response channel
             */

            // Log the output for demo purposes
            //console.log(message);

            // Post the message back to redis on the response channel
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
