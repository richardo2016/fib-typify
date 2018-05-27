#!/usr/bin/env fibjs
var test = require('test');
test.setup();

require('./spec.raw')
require('./spec.fs-file')
require('./spec.fs-directory')

test.run(console.DEBUG)
