var log = require('./keylog.json');

function totalStrokes(start, end) {

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
            // loop through keystrokes in interval
            for (key in log[interval]) {
                // loop through array in keystroke
                for (var i = 0; i < log[interval][key].length; i += 2) {
                    if (log[interval][key][i] !== NaN) {
                        keyCount += parseInt(log[interval][key][i]);
                    }
                }
            }
        }
    }
    return keyCount;
}
