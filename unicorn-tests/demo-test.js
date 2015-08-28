/**
 * Created by lschans on 28/08/15.
 */
var busTalk = require('unicorn/bus-talk'),
    config = require('../config.json');


busTalk.getAnswer('demo', 'math', 'printMessage', 2, process.pid, config).then(function (result) {
    console.log('Demo had a respond %s', result);
});

//busTalk.sendAnswer('demo','','',value,process.pid,config).then(function (result) {
//
//});