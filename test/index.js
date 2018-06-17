#!/usr/bin/env fibjs
var test = require('test');
test.setup();

require('./spec.raw')
require('./spec.fs-file')
require('./spec.fs-directory')

require('./spec.bin')

test.run(console.DEBUG)
