'use strict';

const path = require('path')

exports.tsCacheDir = path.resolve(__dirname, '../.tscache')
exports.inputExt = '.ts'
exports.outputExt = '.js'
exports.logPrefix = '[fib-typify]'
