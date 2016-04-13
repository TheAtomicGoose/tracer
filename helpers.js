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

    // writes a keystroke to the log file as a value whose key is the current datetime.
    // if the key was modified by any modifier keys, those are written with it.
    writeLog: function(keyStroke, logfile, modifiers) {
        var fullLog = require(logfile);
        var key = {"key": keyStroke};
        // if there are modifiers, add an array of modifiers to the key object
        if (modifiers !== undefined && modifiers.length !== 0) {
            key.modifiers = modifiers;
        }
        // make the key object the value of a key-value pair whose key is the current datetime
        fullLog[Date.now()] = key;
        // write the updated log to logfile
        jsonfile.writeFile(logfile, fullLog, {spaces: 4}, function(err) {
            console.error(err);
        });
    }

}
