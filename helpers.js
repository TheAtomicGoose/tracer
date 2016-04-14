var fs = require('fs');
var jsonfile = require('jsonfile');
var util = require('util');

module.exports = {

    // checks if the current key is a modifier, and if it is,
    // returns which modifier it is
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

    // creates a skeleton JSON file with only {} in it
    jsonSkeleton: function(file) {
        var opened = fs.openSync(file, 'w');
        jsonfile.writeFile(file, {}, {spaces: 3}, function(err) {
            console.error(err);
        });
        fs.closeSync(opened);
    },

    // writes keystrokes to the temporary log
    tempLog: function(keyStroke, log, modifiers) {
        // if the key has already been typed exists in this interval's log
        if (log.hasOwnProperty(keyStroke)) {
            // increment its count
            log[keyStroke][0]++;
        } else {
            // make the key in this interval's log and set its count to 1
            log[keyStroke] = [1];
        }
        // if there are modifiers, add an array of modifiers to the key object
        if (modifiers !== undefined && modifiers.length !== 0) {
            log[keyStroke][1] = modifiers;
        }
    },

    // writes a keystroke to the log file as a value whose key is the current datetime.
    // if the key was modified by any modifier keys, those are written with it.
    writeLog: function(intervalLog, logfile, interval) {

        var fullLog = require(logfile);
        var time = new Date().getTime();
        time -= interval;
        fullLog[time] = intervalLog;

        // write the updated log to logfile
        jsonfile.writeFile(logfile, fullLog, {spaces: 4}, function(err) {
            console.error(err);
        });
        intervalLog = {};
    }

}
