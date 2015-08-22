/*************************************************
 Template for a worker process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/
var busmsg = require('unicorn/bus-msg');

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
            // Catch redis message

                //Getting all the services that are handler for this broker
                var msg = JSON.parse(message);

                if (!busmsg.verify(msg))
                    console.log('Wrong Message Format!');
                else {
                    if (msg.ack == 0) {
                        var client = redis.createClient(config.redis.port, config.redis.server, {});
                        var publicChannel = redis.createClient(config.redis.port, config.redis.server, {});

                        if (msg.serviceID == 'broker') {
                            // assign a channel but also should listen in broker main channel call 'broker'

                            var channelName = msg.serviceID + '_' + msg.msgpid;
                            msg.ack = 1;

                            //I respond with the particular channel
                            msg.respondChannel = channelName;
                            publicChannel.publish('broker-init', JSON.stringify(msg));

                            //I respond with the general channel
                            msg.respondChannel = msg.serviceID;
                            publicChannel.publish('broker-init', JSON.stringify(msg));

                            //client.keys('*')
                            client.HSET(msg.serviceID, channelName, 1); //start as active
                            //response


                        } else {
                            msg.ack = 1;
                            msg.respondChannel = msg.serviceID + '_' + msg.msgpid;
                            //I should add one to the broker that is processing this, maybe this should be here CHECK
                            //client.HINCRBY('broker', (msg.serviceID).toString(), 1);   //Add 1 to the hash of services
                            //client.lpush(msg.serviceID, msg.respondChannel);
                            //here i should add one to the hash of the broker that is handler me
                            //response
                            publicChannel.publish('broker-init', JSON.stringify(msg));
                        }
                    }
                }

            console.log('Broker listening on this channel for this service ');

            callback(null, message);
        }
    }
};