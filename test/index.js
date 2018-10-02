#!/usr/bin/env fibjs
var test = require('test');
test.setup();

run('./spec.raw')
run('./spec.fs-file')
run('./spec.fs-directory')

run('./spec.bin')

run('./spec.loader-box')

var fibjsVersion = require('../lib/_utils').fibjsVersion
;(fibjsVersion <= '0.21.0' || require.main === module) && test.run(console.DEBUG)
