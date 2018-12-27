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

exports._filterCompilerOptions = function (tsCompilerOptions) {
    if (tsCompilerOptions.sourceMap) {
        console.warn(`[fib-typify] don't support sourceMap now, tranform to 'inlineSourceMap' automatically.`)
        tsCompilerOptions.sourceMap = false
        tsCompilerOptions.inlineSourceMap = true
    }
}

exports._getTranspilor = function (compilerOptions, fileName, diagnostics, moduleName) {
    return (input, locals) => {
        compilerOptions && exports._filterCompilerOptions(compilerOptions)

        return typescript.transpile(input, _getOptions(compilerOptions, locals), fileName, diagnostics, moduleName)
    }
}

exports._getModuleTransplor = function (moduleOptions) {
    return (input, locals) => {
        moduleOptions.compilerOptions && exports._filterCompilerOptions(moduleOptions.compilerOptions)

        moduleOptions.compilerOptions = _getOptions(moduleOptions.compilerOptions, locals)

        return typescript.transpileModule(input, moduleOptions)
    }
}
