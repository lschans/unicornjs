/*************************************************
 Template for a worker process for a 'redis-mthread' service.
 By: Lars van der Schans ( 2015 )
 *************************************************/

var colors = require('colors');

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
                    channelName = msg.serviceID + '_' + msg.msgpid;
                    msg.ack = 1;
                    msg.respondChannel = channelName; //I respond with the particular channel
                    client.HSET(msg.serviceID, channelName, 1); //start as active
                    //response
                    publicChannel.publish('broker-init', JSON.stringify(msg));
                }else{

                    console.log(msg.serviceID+' in the broker');
                    if (msg.respondChannel == ' ') { //check if this a message or if this is asking for a channel
                        // Assign a channel
                        client.HINCRBY('broker_' + process.pid, msg.serviceID, 1);   //Add 1 to the hash of services
                        channelName = msg.serviceID + '_' + msg.msgpid; // creating service name
                        client.HINCRBY(msg.serviceID, channelName, 1);   //Add 1 to the hash of services
                        msg.ack = 1; // change the state of the msg to process
                        msg.respondChannel = channelName;
                        msg.brokerChain.push({'broker': 'broker_' + process.pid});
                        publicChannel.publish('broker-init', JSON.stringify(msg));
                    }else { // the msg is not asking for a channel
                        //pass the message to a service
                        console.log('I am broker ' + config.process.name + ' processing message... FINALLY');
                        areThereServices(msg.serviceRequired).then(function (boolean) {
                            if (boolean) {
                                checkServiceFlag(msg.serviceRequired).then(function (serviceAvailable) {
                                    console.log('AQUI ' + msg.serviceID + ' ' + typeof (serviceAvailable));

                                    if (typeof (serviceAvailable) == 'undefined')
                                        publicChannel.publish('broker', message);
                                    else
                                        publicChannel.publish(serviceAvailable, JSON.stringify(msg));
                                });
                            } else {
                                publicChannel.publish('broker', message);
                            }
                        });
                        //if (JSON.stringify(obj) != '{}'){
                        //    var keys = [];
                        //    msg.ack = 1;
                        //    publicChannel.publish(keys[0], JSON.stringify(msg));
                        //}

                    }
                }
            }
            callback(null, message);
        }
    };

    function checkServiceFlag (service){
        return new Promise(function (resolve, reject) {
            console.log('checkServiceFlag');
            var publishClient = redis.createClient(config.redis.port, config.redis.server, {});
            publishClient.HGETALL(service, function (err, hash) {
                if (err) reject(err);
                else{

                    console.log('HASH '+ hash)

                    if (typeof (hash) != null){ // There are brokers working
                        var aux;
                        for (var serv in hash){
                            if (hash[serv] == '1') {
                                activateServiceFlag(service).then(function (serviceActive) {
                                    publishClient.HSET(service, serv, 0);
                                    resolve(serv); // return the first it gets
                                })
                            }
                            aux = serv;
                        }
                        // decide if send the last one
                        console.log(aux);
                        resolve(aux);
                    }else{
                        resolve(undefined);
                    }
                }
            })
        })
    }

    function activateServiceFlag (service){
        return new Promise(function (resolve, reject) {
            console.log('activateServiceFlag');
            var publishClient = redis.createClient(config.redis.port, config.redis.server, {});
            publishClient.HGETALL(service, function (err, hash) {
                if (err) reject(err);
                else{
                    var aux;
                    if (typeof (hash) != null){ // There are brokers working
                        for (var serv in hash){
                            if (hash[serv] == '0') {
                                publishClient.HSET(service, serv, 1);
                                resolve(serv); // return the first it gets
                            }
                            aux = serv;
                        }
                        publishClient.HSET('broker', aux, 1);
                        resolve(aux);
                    }else{
                        resolve(undefined);
                    }

                }
            })
        })
    }

    function areThereServices (service){
        return new Promise(function (resolve, reject) {
            console.log('areThereServices');
            var publishClient = redis.createClient(config.redis.port, config.redis.server, {});
            publishClient.HGETALL(service, function (err, hash) {
                if (err) reject(err);
                else{
                    if (typeof (hash) == null){
                        console.log('NO SERVICES YET!')
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                }
            });
        });
    }



};

