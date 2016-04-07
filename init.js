/**
 * init.js initializes everything needed for tracer to work.
 * This includes creating the keylog file and the keymap file.
 */

// requirements
var config = require('./config');
var exec = require('child_process').exec;
var helpers = require('./helpers');
var jsonfile = require('jsonfile');
var util = require('util');

// create log and keymap files and make them skeletal json files
helpers.jsonSkeleton(config.logfile);
helpers.jsonSkeleton(config.keymap);

// "xmodmap -pke" outputs the keymap to stdout
exec('xmodmap -pke', function(error, stdout, stderr) {
    if (error) {
        console.error(error);
    } else if (stderr) {
        console.log('stderr:' + stderr);
    } else {
        processKeymap(stdout);
    }
});

/**
 * Takes in the output of "xmodmap -pke" as the parameter originalMap
 * and parses that output into a json-formatted keymap.
 */
function processKeymap(originalMap) {
    // splits originalMap into lines and removes empty/useless lines
    var xmodmap = originalMap.split('\n').filter(function(line) {
        if (line.length === 0) {
            return false;
        } else if (line.substring(line.indexOf('=') + 1).length < 2) {
            return false;
        } else if (line.indexOf('XF86') > -1) {  // gets rid of media keys
            return false;
        } else {
            return true;
        }
    });

    var keymap = {};  // the json keymap object

    xmodmap.forEach(function(element, index, array) {
        
        var equalIndex = element.indexOf('=');  // the index of this line's equal sign
        
        /*
         * the lines are formatted like 'keycode # = ...', and the numbers are right-justified,
         * so the number can start anywhere from the 9th to 11th character, since they range from
         * 0 to 255. The parseInt(number).toString() gets rid of the potential extra digits
         * that substring might capture (if it copies "  9" or " 40" rather than "102").
        */
        var key = parseInt(element.substring(8, equalIndex - 1)).toString();
        
        var value = [];

        // the key pressed by itself
        var noShift = element.substring(equalIndex + 2, element.indexOf(' ', equalIndex + 2));
        // removes everything up to the shift-modified version of the key
        element = element.substring(element.indexOf(' ', equalIndex + 2) + 1); 
        // the key modified by shift
        var shift = element.substring(0, element.indexOf(' '));

        value[0] = noShift;

        // if the shift-modified key is an actual key, add it as the second element in value
        if (shift !== 'NoSymbol' && shift !== noShift) {
            value[1] = shift;
        }

        // add key-value pair to keymap
        keymap[key] = value;
    });

    // write keymap to keymap json file
    jsonfile.writeFile(config.keymap, keymap, {spaces: 3}, function(err) {
        console.error(err);
    });
}
