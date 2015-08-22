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
            var channelName;
            if (!busmsg.verify(msg))
                console.log('Wrong Message Format!');
            else {
                var client = redis.createClient(config.redis.port, config.redis.server, {});
                if (msg.ack == 0) {
                    var publicChannel = redis.createClient(config.redis.port, config.redis.server, {});

                    if (msg.serviceID == 'broker') {
                        // assign a channel but also should listen in broker main channel call 'broker'
                        console.log('broker message');
                        channelName = msg.serviceID + '_' + msg.msgpid;
                        msg.ack = 1;
                        //I respond with the particular channel
                        msg.respondChannel = channelName;
                        client.HSET(msg.serviceID, channelName, 1); //start as active
                        //response
                        publicChannel.publish('broker-init', JSON.stringify(msg));
                    }else{
                        //check if this a message or if this is asking for a channel
                        if (msg.respondChannel == ' ') {
                            // Assign a channel
                            console.log('i am broker '+process.pid);
                            client.HINCRBY('broker_'+process.pid, msg.serviceID, 1);   //Add 1 to the hash of services
                            //Pushing the channel to the list of channels of the service
                            channelName = msg.serviceID + '_' + msg.msgpid;
                            client.HINCRBY((msg.serviceID).toString(), channelName.toString(), 1);   //Add 1 to the hash of services
                            msg.ack = 1;
                            msg.respondChannel = channelName;
                            publicChannel.publish('broker_'+process.pid, JSON.stringify(msg));
                        }else{
                            //pass the message to a service
                            //check services and send the message for the service to work
                            console.log('i am broker '+process.pid+' processing message... finally');

                            //verify is i have this service assign
                            console.log(client.hget('broker_'+process.pid, msg.serviceID));

                            //Pushing the channel to the list of channels of the service
                            channelName = msg.serviceID + '_' + msg.msgpid;
                            msg.ack = 1;
                            msg.respondChannel = channelName;
                            publicChannel.publish('broker_'+process.pid, JSON.stringify(msg));
                        }

                        //I should add one to the broker that is processing this, maybe this should be here CHECK
                        //here i should add one to the hash of the broker that is handler me
                        //response
                        //response
                    }
                }
            }

            console.log('Broker listening on this channel for this service ');

            callback(null, message);
        }
    }
};