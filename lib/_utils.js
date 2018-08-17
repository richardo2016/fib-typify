const vm = require('vm')
const util = require('util')

const mkdirp = require('@fibjs/mkdirp')

const CORE = require('./core')

function time () {
    return new Date()
}
const isDebug = exports.isDebug = !!process.env.FIB_DEBUG

exports.mkdirp = (...args) => {
    isDebug && console.log(`${getLogPrefix('io', 'mkdirp')}`)
    return mkdirp(...args)
}

const getLogPrefix = exports.getLogPrefix = (domain = 'default', action = 'action') => {
    return `${CORE.logPrefix}[${domain}:${action}] - [${time()}]  `
}

exports.isWithCustomLoaderFunction = function () {
    const sbox = new vm.SandBox({})

    return util.isFunction(sbox.setModuleCompiler)
}

exports.fibjsVersion = util.buildInfo().fibjs

exports.tsCompilerOptions = {
    target: 'es6',
    module: 'commonjs',
    // moduleResolution: 'node',
    noImplicitUseStrict: true
}

const TS_SUFFIX = exports.TS_SUFFIX = '.ts'

const builtModules = {}
const modVersionMap = require('./builtin-modules')
const moduleList = [
    ...(util.buildInfo().modules || []),
    ...modVersionMap[util.buildInfo().fibjs] ? modVersionMap[util.buildInfo().fibjs] : modVersionMap['default']
]
moduleList.forEach(moduleName => {
    builtModules[moduleName] = require(moduleName)
})
exports.builtModules = builtModules

const fibTypifyRaw = require('./raw')
exports.registerTsCompiler = (sandbox, tsCompilerOptions = exports.tsCompilerOptions) => {
    sandbox.setModuleCompiler(TS_SUFFIX, (buf, args) => {
        let tsScriptString = buf + ''
        if (tsScriptString.length > 2 && tsScriptString.indexOf('#!') === 0) {
            tsScriptString = '//' + tsScriptString;
        }

        if (!tsScriptString) return undefined

        const compiledScript = fibTypifyRaw.compileRaw(tsScriptString, tsCompilerOptions)
        return compiledScript
    })
}
