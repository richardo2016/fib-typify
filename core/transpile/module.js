const ts = require('typescript')

const { getCompilerOptions } = require('../ts-apis/transpilor')

exports.compileModule = function (tsRaw = '', moduleOptions) {
    moduleOptions.compilerOptions = getCompilerOptions(moduleOptions.compilerOptions)

    return ts.transpileModule(tsRaw, moduleOptions)
}
