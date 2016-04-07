Tracer
======

Tracer is in the beginning stages of development. The final version will track keyboard usage, and allow users to visualize their typing in various ways: sorted by time, most typed letters, etc.


## Prerequisites

These must be installed separately:

* `xinput`
* `xmodmap`

## Installation

1. Get a local copy of `tracer` with  `git clone git@github.com:TheAtomicGoose/tracer.git`, and move into the new directory with `cd tracer`.
2. Copy the sample configuration file with `cp config.sample.json config.json`. Within `config.json`, change the paths to the various files if you want them stored in a different place. (If you change where the config file is/what it's named, don't forget to actually move/rename it!)
3. Run `node init.js` to generate your keymap file, and initialize a couple other things.

## Usage
Execute `tracer` by running `node index.js` inside of your `tracer` directory.
