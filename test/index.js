#!/usr/bin/env fibjs
var test = require('test');
test.setup();

var fibjsVersion = require('util').buildInfo().fibjs
if (fibjsVersion <= '0.21.0')
    require.main = module

const Typify = require('../')

run('./spec.raw')
run('./spec.fs-file')
run('./spec.fs-directory')

run('./spec.bin')

run('./spec.loader-box')

if (fibjsVersion >= '0.26.0') {
    run('./spec.source-map')
    Typify.loader({
        compilerOptions: {
            inlineSourceMap: true
        }
    }).sandbox().require('./spec.source-map', __dirname)
}

if (require.main === module) {
    test.run(console.DEBUG)
}
