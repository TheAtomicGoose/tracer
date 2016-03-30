var helpers = require("./helpers");
var jsonfile = require('jsonfile');
var spawn = require('child_process').spawn;
var util = require('util');

var keyboardId = 10;            // xinput device
var tempLog = [];               // temporary storage
var logFile = './keylog.json';  // keylog file

// configure jsonfile
jsonfile.spaces = 4;

// spawn the xinput process
xinput = spawn('xinput', ['test', keyboardId]);

// write temporary log to permanent storage every 5 minutes
setInterval(helpers.writeLog(tempLog, logFile), 50000);

// on stdout
xinput.stdout.on('data', (data) => {
    console.log(JSON.stringify(data));
    if (data.indexOf("press") !== -1) {
        tempLog.push(parseFloat(data.substring(data.length - 3)));
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
    console.log('failed to start xinput');
});
