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