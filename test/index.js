#!/usr/bin/env fibjs
var test = require('test');
test.setup();

var fibjsVersion = require('util').buildInfo().fibjs
if (fibjsVersion <= '0.21.0')
    require.main = module

const Typify = require('../')

require('./spec.ts-intf')

require('./spec.raw')
require('./spec.fs-file')
require('./spec.fs-directory')

require('./spec.bin')

require('./spec.loader-box')

require('./spec.program')

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
