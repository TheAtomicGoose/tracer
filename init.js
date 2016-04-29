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

    var keymap = {};    // the json keymap object
    var mods = {'alt': [], 'ctrl': [], 'shft': [],  'spr': []};  // ctrl, shift, alt, super

    xmodmap.forEach(function(element, index, array) {
        
        var equalIndex = element.indexOf('=');  // the index of this line's equal sign
        
        /*
         * the lines are formatted like 'keycode # = ...', and the numbers are right-justified,
         * so the number can start anywhere from the 9th to 11th character, since they range from
         * 0 to 255. The parseInt(number).toString() gets rid of the potential extra characters
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

        // if the current key is a modifier key, add it to mods
        modifierAdd(noShift, key, mods);

        // if the non-shift-modified key doesn't exist, skip this key
        if (noShift === 'NoSymbol') {
            return;
        }

        value[0] = noShift;

        // if the shift-modified key is an actual key and is not an alphabetic
        // character, add it as the second element in value
        if (shift !== 'NoSymbol' && shift !== noShift.toUpperCase()) {
            value[1] = shift;
        }

        // add key-value pair to keymap
        keymap[key] = value;
    });

    // make mods part of keymap
    keymap.modifiers = mods;

    // write keymap to keymap json file
    jsonfile.writeFile(config.keymap, keymap, {spaces: 3}, function(err) {
        console.error(err);
    });
}

/**
 * modifierAdd() takes the textual value of a key, the keymap number of
 * a key, and an object, and checks if any of the keys of the object (all
 * of which are modifier keys) are contained in the textual value of the key
 * passed in. If so, the keymap number of the key is added to the corresponding
 * array in modObject.
 */
function modifierAdd(key, keyNum, modObject) {
    
    // get all the possible modifiers
    modifiers = Object.keys(modObject);

    // add the keyNum of the modifier to that modifier's
    // array in the modifier object. the reason for the individual
    // if statements is so that keys can be abbreviated; e.g. control
    // gets put into 'ctrl' in the modifier object
    if(key.toLowerCase().includes('alt')) {
        modObject['alt'].push(keyNum);
    } else if(key.toLowerCase().includes('control')) {
        modObject['ctrl'].push(keyNum);
    } else if (key.toLowerCase().includes('shift')) {
        modObject['shft'].push(keyNum);
    } else if (key.toLowerCase().includes('super')) {
        modObject['spr'].push(keyNum);
    }
    return;
}
