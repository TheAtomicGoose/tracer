var log = require('./keylog.json');
var config = require('./config.json');

function numStrokes(start, end) {

    var keyCount = 0;

    /*
     * If the end time is defined, actually use it. Otherwise, make the end date
     * the latest supported date so that the endTime comparison will always be true.
     */
    var endTime;
    if (end !== undefined) {
        endTime = end;
    } else {
        endTime = new Date(8640000000000000);  // the latest possible date
    }

    // loop through intervals in log
    for (var interval in log) {
        if (interval >= start && interval <= endTime) {
            keyCount += sumInterval(log[interval]);
        }
    }
    console.log(keyCount);
    return keyCount;
}

function timeSort(unit, start, end) {
    var included = [];
    var interval;
    if (unit === 'minutes') {
        // if the defined interval is larger than a minute and smaller than an hour
        if (config.interval > 60000 && config.interval < 60 * 60000) {
            interval = config.interval;
        // if the configured interval is an hour or more
        } else if (config.interval >= 60 * 60000) {
            console.error('Interval configured in config.json is too large to sort by minutes.');
        } else {
            interval = 60000;
        }
    } else if (unit === 'hours') {
        // if the defined interval is larger than an hour and smaller than a day
        if (config.interval > 60 * 60000 && config.interval < 24 * 60 * 60000) {
            interval = config.interval;
            // if the configured interval is a day or more
        } else if (config.interval >= 24 * 60 * 60000) {
            console.error('Interval configured in config.json is too large to sort by hours.');
        } else {
            interval = 60 * 60000;
        }
    } else {

    }
}

function sumInterval(interval) {
    var intervalCount = 0;
    // loop through keystrokes in interval
    for (key in interval) {
        // loop through array in keystroke
        for (var i = 0; i < interval[key].length; i += 2) {
            if (interval[key][i] !== NaN) {
                intervalCount += parseInt(interval[key][i]);
            }
        }
    }
    return intervalCount;
}
