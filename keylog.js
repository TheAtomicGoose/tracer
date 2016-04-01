var fs = require('fs');
var helpers = require('./helpers');
var spawn = require('child_process').spawn;

var keyboardId = 12;            // xinput device
var tempLog = [];               // temporary storage
var logFile = './keylog.json';  // keylog file

// makes sure keylog.json exists
fs.open(logFile, 'wx', function(err, fd) {
    fs.writeFile(logFile, JSON.stringify({}), (err) => {
        fs.close(fd, function(closeErr) {
            console.log(closeErr);
        });
    });
});

// spawn the xinput process
xinput = spawn('xinput', ['test', keyboardId]);

// write temporary log to permanent storage every 5 minutes
setInterval(function() { helpers.writeLog(tempLog, logFile); }, 50);

// on stdout
xinput.stdout.on('data', (data) => {
    data = data.toString('utf8');
    if (data.indexOf("press") !== -1) {
        tempLog.push(parseFloat(data.substring(data.length - 4, data.length - 2)));
        console.log(tempLog);
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
