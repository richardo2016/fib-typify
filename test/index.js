#!/usr/bin/env fibjs
var test = require('test');
test.setup();

run('./spec.raw')
run('./spec.fs-file')
run('./spec.fs-directory')

run('./spec.bin')

run('./spec.loader-box')

require.main === module && test.run(console.DEBUG)
