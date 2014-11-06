# Contributing

## Important notes

Please don't edit files in the `dist` subdirectory as they are generated via Grunt.
You'll find source code in the `src` subdirectory! There is also some skeleton code
in the `browser` directory that allows you to run the unit tests in a browser and
see a minimalistic example of using the code in a browser environment.

### Code style

Regarding code style like indentation and whitespace, **follow the conventions you
see used in the source already.**

### PhantomJS

Grunt runs the included tests via [PhantomJS](http://phantomjs.org/), but for full
compatibility you should be sure to run the unit tests in _actual_ browsers. You
can do this by running `bin/start-test-server.sh` and navigating to
http://localhost:8000/browser/test/

## Modifying the code

First, ensure that you have the latest [Node.js](http://nodejs.org/) and
[npm](http://npmjs.org/) installed.

Test that Grunt's CLI is installed by running `grunt --version`.  If the command
isn't found, run `npm install -g grunt-cli`.  For more information about installing
Grunt, see the [getting started guide](http://gruntjs.com/getting-started).

 1. Fork and clone the repo.
 1. Run `npm install` to install all dependencies (including Grunt).
 1. Run `grunt` to grunt this project.
 1. Alternatively, run ```build/watch``` to continuously watch for changes.

Assuming that you don't see any red, you're ready to go. Just be sure to run `grunt`
after making any changes, to ensure that nothing is broken.

## Submitting pull requests

 1. Create a new branch, please don't work in your `master` branch directly.
 1. Add failing tests for the change you want to make. Run `grunt` to see the tests fail.
 1. Fix stuff.
 1. Run `grunt` to see if the tests pass. Repeat steps 2-4 until done.
 1. Run the unit tests in an actual browser as described above to ensure tests pass everywhere.
 1. Update the documentation to reflect any changes.
 1. Push to your fork and submit a pull request.
