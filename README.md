Tracer
======

Tracer is in the beginning stages of development. The final version will track keyboard usage, and allow users to visualize their typing in various ways: sorted by time, most typed letters, etc.

**Dependencies:** `xinput`, and `xmodmap` for future compatibility, once more features are implemented.

**Installation:** First, `git clone git@github.com:TheAtomicGoose/tracer.git`. Move into the repository with `cd tracer`. Then, copy the sample configuration file: `cp config.sample.json config.json`. Inside of `config.json`, change `device` to the device id of your keyboard (according to `xinput`). Then, if you want the log of your keystrokes to be somewhere other than `tracer/keylog.json`, change `logfile`'s path inside of `config.json`.

You should now be good to go! Execute `tracer` by running `node index.js` inside of your local `tracer` repository.
