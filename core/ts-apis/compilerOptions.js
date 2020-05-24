const ts = require('typescript')

// CompilerOptions
const compilerOptions = {
    module: ts.ModuleKind.CommonJS
}

exports.getDefaultCompilerOptions = () => compilerOptions

exports.filterCompilerOptions = function (compilerOptions) {
    if (compilerOptions.sourceMap) {
        console.warn(`[fib-typify] don't support sourceMap now, tranform to 'inlineSourceMap' automatically.`)
        compilerOptions.sourceMap = false
        compilerOptions.inlineSourceMap = true
    }
}

/**
 * @description return one ts.ParseConfigHost
 */
exports.getParseConfigHost = (compilerHost, cwd) => {
    // this API is from typescript, not documented
    return ts.createCachedDirectoryStructureHost(compilerHost, cwd, process.platform !== 'win32')
}