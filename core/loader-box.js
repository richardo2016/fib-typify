/**
 * require fibjs >= 0.26.0
 */
const vm = require('vm')

const UTILs = require('./_utils')
const { isSupportSetModuleCompiler, hackFibjs } = require('./compat')

const generateLoaderbox = exports.generateLoaderbox = function (tsCompilerOptions) {
    const tsSandbox = new vm.SandBox(UTILs.builtModules)

    if (isSupportSetModuleCompiler()) {
        UTILs.registerTsCompiler(tsSandbox, tsCompilerOptions)
    } else { // compat old version
        hackFibjs(tsSandbox, tsCompilerOptions)
    }

    return tsSandbox
}

exports.defaultBox = generateLoaderbox()
