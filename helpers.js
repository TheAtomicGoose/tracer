var fs = require('fs');
var jsonfile = require('jsonfile');
var util = require('util');

module.exports = {

    /*
     * checkModifier() checks if keyStroke is a modifier (alt, ctrl, shft, spr)
     * and if it is, returns which modifier key it is. If the key is not a modifier,
     * it returns false.
     */
    checkModifier: function(keyStroke) {
        // get modifier keymap numbers
        var keymap = require('./keymap');
        var modifiers = keymap.modifiers;
        // loop through each modifier
        for (key in modifiers) {
            if (modifiers.hasOwnProperty(key)) {
                if (modifiers[key].indexOf(keyStroke) > -1) {
                    return key;
                }
            }
        }
        // if the key isn't a modifier
        return false;
    },

    /*
     * jsonSkeleton() creates a file with a usable JSON skeleton in
     * it, e.g. {}.
     */
    jsonSkeleton: function(file) {
        var opened = fs.openSync(file, 'w');
        jsonfile.writeFile(file, {}, {spaces: 3}, function(err) {
            console.error(err);
        });
        fs.closeSync(opened);
    },

    /*
     * tempLog() writes keyStroke to log, and also writes modifiers
     * to log with keyStroke if they exist.
     */
    tempLog: function(keyStroke, log, modifiers) {
        // give the keystroke an array if it doesn't have one
        if (!log.hasOwnProperty(keyStroke)) {
            log[keyStroke] = [0];
        }

        // if there are modifiers, the key's count isn't incremented, but the
        // count of that particular set of modifiers is.
        if (modifiers !== undefined && modifiers.length > 0) {
            modifiers = modifiers.sort();
            var index = log[keyStroke].indexOf(modifiers);
            // if this particular set of modifiers hasn't been used yet on this key
            if (index === -1) {
                // add the array of modifiers to log[keyStroke] and the number of times
                // that it's been used (1 at this point) as the next index after
                log[keyStroke].push(modifiers, 1);
            } else {
                // increment the count of how many times this combination of modifiers
                // has been used
                log[keyStroke][index + 1]++;
            }
        } else {  // if there are no modifiers
            log[keyStroke][0]++;
        }
    },

    /*
     * writeLog() writes a temporary log (in the form of a JSON object) to the
     * permanent log, passed in as logfile.
     */
    writeLog: function(intervalLog, logfile, interval) {
        if (Object.keys(intervalLog).length !== 0) {
            var fullLog = require(logfile);
            // make the time at which this log was started the key for the interval log in the logfile
            var time = new Date().getTime();
            time -= interval;
            fullLog[time] = intervalLog;

            // write the updated log to logfile
            jsonfile.writeFile(logfile, fullLog, {spaces: 3}, function(err) {
                console.error(err);
            });
        }
    }
}
