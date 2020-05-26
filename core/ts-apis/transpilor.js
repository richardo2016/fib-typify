const ts = require('typescript')
/**
 * ts.transpile and ts.transpileModule is low-level API in typescript
 * 
 * sometimes you want to compile script fragment manually rather than run the whole
 * program, you could use exported functions here.
 */
const { getDefaultCompilerOptions } = require('./compilerOptions')

const getCompilerOptions = exports.getCompilerOptions = function getCompilerOptions(options, locals) {
    return ({
        ...getDefaultCompilerOptions(),
        ...options,
        ...locals
    })
}

exports.getTranspilor = function (compilerOptions, fileName, diagnostics, moduleName) {
    return (input, locals) => {
        return ts.transpile(input, getCompilerOptions(compilerOptions, locals), fileName, diagnostics, moduleName)
    }
}