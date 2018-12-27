/**
 * require fibjs >= 0.26.0
 */
const vm = require('vm')

const UTILs = require('./_utils')
const { hackFibjs } = require('./compat')

function generateLoaderbox (tsCompilerOptions) {
    const tsSandbox = new vm.SandBox(UTILs.builtModules)

    if (UTILs.isWithCustomLoaderFunction()) {
        UTILs.registerTsCompiler(tsSandbox, tsCompilerOptions)
    } else { // compat old version
        hackFibjs(tsSandbox, tsCompilerOptions)
    }

    return tsSandbox
}

exports.generateLoaderbox = generateLoaderbox
exports.defaultBox = generateLoaderbox()
