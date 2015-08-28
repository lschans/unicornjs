/**
 * Created by lschans on 28/08/15.
 */
var busTalk = require('unicorn/bus-talk'),
    config = require('../config.json'),
    redis = require('redis');



var publishClient = redis.createClient(config.redis.port, config.redis.server, {});
var listenClient = redis.createClient(config.redis.port, config.redis.server, {});


/* Listener waiting for the answer */
listenClient.on("message", function (channel, message) {
    /* Process incoming message and respond to response channel */
    /* listen to the new channel */

    console.log('I have a message');

    var msg = JSON.parse(message);

    console.log(msg);
    if (msg.ack == 0){
        listenClient.unsubscribe();
        listenClient.end();

        var data = msg.data;

        console.log('applying $s to %s', msg.function, data.value);

        busTalk.sendAnswer('math',msg.respondChannel,msg.function,data,process.pid,config).then(function (result) {

        });

    }

});

listenClient.subscribe('mathPrivateChannel');


//busTalk.getAnswer('demo', 'math', 'printMessage', 2, process.pid, config).then(function (result) {
//    console.log('Demo had a respond %s', result);
//});
