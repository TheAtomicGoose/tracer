var jsonfile = require('jsonfile');
var util = require('util');

module.exports = {
    writeLog: function(jsonLog, logFile) {
        if (jsonLog.length > 0) {
            var fullLog = require(logFile);
            fullLog[Date.now()] = jsonLog;
            jsonfile.writeFile(logFile, fullLog, {spaces: 4}, function(err) {
                console.error(err);
            });
            jsonLog.length = 0;
        }
    }
}
