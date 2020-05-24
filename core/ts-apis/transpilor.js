const ts = require('typescript')
/**
 * ts.transpile and ts.transpileModule is low-level API in typescript
 * 
 * sometimes you want to compile script fragment manually rather than run the whole
 * program, you could use exported functions here.
 */
const { filterCompilerOptions, getDefaultCompilerOptions } = require('./compilerOptions')

function _getOptions(options, locals) {
    return ({
        ...getDefaultCompilerOptions(),
        ...options,
        ...locals
    })
}

exports.getTranspilor = function (compilerOptions, fileName, diagnostics, moduleName) {
    return (input, locals) => {
        compilerOptions && filterCompilerOptions(compilerOptions)

        return ts.transpile(input, _getOptions(compilerOptions, locals), fileName, diagnostics, moduleName)
    }
}

exports.getModuleTranspilor = function (moduleOptions) {
    return (input, locals) => {
        if (moduleOptions.compilerOptions)
            filterCompilerOptions(moduleOptions.compilerOptions)

        moduleOptions.compilerOptions = _getOptions(moduleOptions.compilerOptions, locals)

        return ts.transpileModule(input, moduleOptions)
    }
}