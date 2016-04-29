var config = require('./config');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var helpers = require('./helpers');
var spawn = require('child_process').spawn;

var keyboardId = config.device;  // xinput device
var logfile = config.logfile;    // keylog file

// makes sure keylog.json exists
fs.stat(logfile, function(err, stat) {
    // if logfile does not exist
    if (err && err.code == 'ENOENT') {
        helpers.jsonSkeleton(logfile);
    };
});

// spawn the xinput process
xinput = spawn('xinput', ['test', keyboardId]);

var intervalLog = {};
var modifiers = [];

// an event emitter for emptying intervalLog
var emptyLog = new EventEmitter();
// on 'clear' event, empty intervalLog
emptyLog.on('empty', function() {
    intervalLog = {};
});

/*
 * write the temp keylog to the permanent keylog as frequently as is
 * specified in the config file. after writing, empty the temp keylog object.
 */
setInterval(function() { 
    helpers.writeLog(intervalLog, logfile, config.interval);
    emptyLog.emit('empty');
}, config.interval);

// on stdout
xinput.stdout.on('data', (data) => {
    data = data.toString('utf8').substring(data.indexOf(' '));
    var keyNum = data.substring(data.search(/[0-9]+/), data.length - 2);
    if (data.indexOf('press') > -1) {
        var modCheck = helpers.checkModifier(keyNum);
        if (modCheck && modifiers.indexOf(modCheck) === -1) {  // if this key is a modifier
            // add it to the modifiers array and write it to the keylog
            modifiers.push(modCheck);
            helpers.tempLog(keyNum, intervalLog);
        } else {
            // add the non-modifier key to the keylog with its modifiers
            helpers.tempLog(keyNum, intervalLog, modifiers);
            modifiers = [];
        }
    }
});

// on stderr
xinput.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

// on child process exit
xinput.on('close', (code) => {
    console.log(`xinput exited with code ${code}`);
});

// on child process spawn error
xinput.on('error', (err) => {
    console.error('failed to start xinput');
});
