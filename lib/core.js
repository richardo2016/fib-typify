'use strict';

const path = require('path')
const typescript = require('typescript')
const { extend } = require('util')

// CompilerOptions
const compilerOptions = {
  module: typescript.ModuleKind.CommonJS
}

function _getOptions(options, locals) {
  return extend({}, compilerOptions, options, locals)
}

exports.tsCacheDir = path.resolve(__dirname, '../.tscache')
exports.inputExt = '.ts'
exports.outputExt = '.js'
exports.logPrefix = '[fib-typify]'

exports._getTranspilor = function (options) {
    return (tsRaw, locals) => {
        return typescript.transpile(tsRaw, _getOptions(options, locals))
    }
}
