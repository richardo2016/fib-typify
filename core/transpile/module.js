const ts = require('typescript')

const { getCompilerOptions } = require('../ts-apis/transpilor')

/**
 *
 * @param {string | Class_Buffer} tsRaw
 * @param {ts.TranspileOptions} moduleOptions
 */
exports.compileModule = function (tsRaw = '', moduleOptions) {
    moduleOptions.compilerOptions = getCompilerOptions(moduleOptions.compilerOptions)

    return ts.transpileModule(tsRaw, moduleOptions)
}
