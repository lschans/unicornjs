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

                console.log(busmsg.verify(msg));

                if (!busmsg.verify(msg))
                    console.log('Wrong Message Format!');
                else {
                    if (msg.ack == 0) {
                        var client = redis.createClient(config.redis.port, config.redis.server, {});

                        if (msg.serviceID == 'broker'){

                            console.log('somebody is processing me!');
                            // check if there is another broker running

                            client.keys('*')

                                //msg.ack = 1;
                                //msg.respondChannel = msg.serviceID + '_' + msg.msgpid;
                                //client.lpush(msg.serviceID, msg.respondChannel);
                                //client.HINCRBY('broker' + msg.msgpid, (msg.serviceID).toString(), 1);   //Add 1 to the hash of services

                        }else{
                            client.HINCRBY('broker', (msg.serviceID).toString(), 1);   //Add 1 to the hash of services
                            //Pushing the channel to the list of channels of the service
                            //setting the response attributes
                            msg.ack = 1;
                            msg.respondChannel =  msg.serviceID+'_'+msg.msgpid;
                            client.lpush(msg.serviceID, msg.respondChannel);
                            //response
                            var pChannel = redis.createClient(config.redis.port, config.redis.server, {});
                            pChannel.publish('broker-init', JSON.stringify(msg));

                        }


                    }
                }
            console.log('Broker listening on this channel for this service ');

            callback(null, message);
        }
    }
};