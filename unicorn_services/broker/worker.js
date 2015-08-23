/*************************************************
 Template for a worker process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/
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
            //Getting all the services that are handler for this broker
            var msg = JSON.parse(message); // I trust redis to check the msg format
            var channelName;
            var client = redis.createClient(config.redis.port, config.redis.server, {});
            if (msg.ack == 0) {
                var publicChannel = redis.createClient(config.redis.port, config.redis.server, {});

                if (msg.serviceID == 'broker') {
                    // assign a channel but also should listen in broker main channel call 'broker'
                    console.log('broker message');
                    channelName = msg.serviceID + '_' + msg.msgpid;
                    msg.ack = 1;
                    msg.respondChannel = channelName; //I respond with the particular channel
                    client.HSET(msg.serviceID, channelName, 1); //start as active
                    //response
                    publicChannel.publish('broker-init', JSON.stringify(msg));
                }else{
                    if (msg.respondChannel == ' ') { //check if this a message or if this is asking for a channel
                        // Assign a channel
                        console.log('I am broker ' + process.pid);
                        client.HINCRBY('broker_' + process.pid, msg.serviceID, 1);   //Add 1 to the hash of services
                        channelName = msg.serviceID + '_' + msg.msgpid; // creating service name
                        client.HINCRBY((msg.serviceID).toString(), channelName.toString(), 1);   //Add 1 to the hash of services
                        msg.ack = 1; // change the state of the msg to process
                        msg.respondChannel = channelName;
                        publicChannel.publish('broker_' + process.pid, JSON.stringify(msg));
                    }else{ // the msg is not asking for a channel
                        //pass the message to a service
                        console.log('I am broker ' + config.process.name + ' processing message... finally');
                        console.log(client.hget('broker_' + process.pid, msg.serviceID));
                        //Pushing the channel to the list of channels of the service
                        channelName = msg.serviceID + '_' + msg.msgpid;
                        msg.ack = 1;
                        msg.respondChannel = channelName;
                        publicChannel.publish('broker_' + process.pid, JSON.stringify(msg));
                    }
                }
            }

            callback(null, message);
        }
    }
};