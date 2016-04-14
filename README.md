Tracer
======

Tracer is in the beginning stages of development. The final version will track keyboard usage, and allow users to visualize their typing in various ways: sorted by time, most typed letters, etc.


## Prerequisites

These must be installed separately:

* `xinput`
* `xmodmap`

You also need to know the device id of your keyboard. You can find it by executing `xinput`, and testing each id that appears with `xinput test <id>`. The id that produces output when you type after executing that command is the one that you should remember.

## Installation

1. Get a local copy of `tracer` with  `git clone git@github.com:TheAtomicGoose/tracer.git`, and move into the new directory with `cd tracer`.
2. Copy the sample configuration file with `cp config.sample.json config.json`. Within `config.json`, change `device` to the device id you found earlier, and change the paths to the various files if you want them stored in a different place. `interval` is the smallest interval of time you can analyze, in milliseconds. It's an hour by default - it's not recommended to make it below a minute.
3. Run `node init.js` to generate your keymap file, and initialize a couple other things.

## Usage
Execute `tracer` by running `node index.js` inside of your `tracer` directory.
