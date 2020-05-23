const fs = require('fs')
const util = require('util')
const path = require('path')
const vm = require('vm')

const FILE = require('./transpile/fs-file')
const UTILs = require('./_utils')

exports.isSupportSetModuleCompiler = function () {
    const sbox = new vm.SandBox({})

    return util.isFunction(sbox.setModuleCompiler)
}

exports.hackFibjs = function (tsSandbox, tsCompilerOptions) {
    const basedir = __dirname
    let __orig_require = tsSandbox.require.bind(tsSandbox)

    const hackedRequireFn = function (...args) {
        UTILs.isDebug && console.warn(`${UTILs.getLogPrefix('loader-box', 'generateLoaderbox')} compat version has no full-support for require('xxx') when only 'xxx.ts' exists, upgrade fibjs>=0.26.0`)
        let moduleId = args[0]
        let _basedir = args[1] || basedir

        if (!moduleId || typeof moduleId !== 'string')
            throw 'moduleId must be string'

        const jsfilepath = path.resolve(_basedir, moduleId + '.js')
        const jsonfilepath = path.resolve(_basedir, moduleId + '.json')
        const jscfilepath = path.resolve(_basedir, moduleId + '.jsc')
        const hasTsSuffix = moduleId.endsWith(UTILs.TS_SUFFIX)
        if (!hasTsSuffix) {
            if (moduleId.endsWith('.js')) return __orig_require(moduleId, _basedir)
            if (fs.exists(jsfilepath)) return __orig_require(jsfilepath, _basedir)
            if (moduleId.endsWith('.json')) return __orig_require(moduleId, _basedir)
            if (fs.exists(jsonfilepath)) return __orig_require(jsonfilepath, _basedir)
            if (moduleId.endsWith('.jsc')) return __orig_require(moduleId, _basedir)
            if (fs.exists(jscfilepath)) return __orig_require(jscfilepath, _basedir)
        }

        let tsfilepath = path.resolve(_basedir, moduleId + (hasTsSuffix ? '' : UTILs.TS_SUFFIX))

        FILE.compileFileToSandBox(tsfilepath, {
            sandbox: tsSandbox,
            moduleName: tsfilepath
        }, tsCompilerOptions)

        return __orig_require(tsfilepath, _basedir)
    }

    tsSandbox.require = hackedRequireFn.bind(tsSandbox)
}
