const vm = require('vm')
const fs = require('fs')
const path = require('path')
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

exports.getLogPrefix = function getLogPrefix (domain = 'default', action = 'action') {
    return `${CORE.logPrefix}[${domain}:${action}] - [${time()}]  `
}

exports.extendCompilerConfigFromTSConfig = function (origConfig = {}) {
    let tsConfigFilepath = path.resolve(process.cwd(), 'tsconfig.json')

    if (tsConfigFilepath && fs.exists(tsConfigFilepath) && fs.stat(tsConfigFilepath).isFile()) {
        let tsConfig = require(tsConfigFilepath) || {}
        origConfig = util.extend({}, origConfig, tsConfig.compilerOptions)
    }

    return origConfig
}

exports.isWithCustomLoaderFunction = function () {
    const sbox = new vm.SandBox({})

    return util.isFunction(sbox.setModuleCompiler)
}

exports.defaultCompilerOptions = {
    target: 'es6',
    module: 'commonjs',
    noImplicitUseStrict: true
}

exports.getCwdTsCompilerOptions = function () {
    return exports.extendCompilerConfigFromTSConfig(util.extend({}, exports.defaultCompilerOptions))
}

const TS_SUFFIX = exports.TS_SUFFIX = '.ts'

exports.builtModules = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

const fibTypifyRaw = require('./raw')
exports.registerTsCompiler = (sandbox, tsCompilerOptions = exports.getCwdTsCompilerOptions()) => {
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
