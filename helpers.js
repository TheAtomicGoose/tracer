var fs = require('fs');
var jsonfile = require('jsonfile');
var util = require('util');

module.exports = {

    // creates a skeleton JSON file with only {} in it
    jsonSkeleton: function(file) {
        var opened = fs.openSync(file, 'w');
        jsonfile.writeFile(file, {}, {spaces: 3}, function(err) {
            console.error(err);
        });
        fs.closeSync(opened);
    },

    // writes a keystroke to the log file as a value whose key is the current datetime
    writeLog: function(keyStroke, logFile) {
        var fullLog = require(logFile);
        fullLog[Date.now()] = keyStroke;
        jsonfile.writeFile(logFile, fullLog, {spaces: 4}, function(err) {
            console.error(err);
        });
    }

}
