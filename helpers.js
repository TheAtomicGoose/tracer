var jsonfile = require('jsonfile');

module.exports = {
    writeLog: function(jsonLog, logFile) {
        if (!isEmptyObject(jsonLog)) {
            var timestamped = {};
            timestamped[Date.now()] = jsonLog;
            jsonfile.writeFile(logFile, timestamped, function(err) {
                console.log(err);
            });
        }
    }
}

function isEmptyObject(obj) {
    return Object.keys(obj).length;
}
