var config = require('./config');
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

var modifiers = [];

// on stdout
xinput.stdout.on('data', (data) => {
    data = data.toString('utf8');
    var keyNum = data.substring(data.length - 4, data.length - 2);
    if (data.indexOf('press') > -1) {
        var modCheck = helpers.checkModifier(keyNum);
        if (modCheck) {  // if this key is a modifier
            // add it to the modifiers array and write it to the keylog
            modifiers.push(modCheck);
            helpers.writeLog(keyNum, logfile);
        } else {
            // add the non-modifier key to the keylog with its modifiers
            helpers.writeLog(keyNum, logfile, modifiers);
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
