/**
 * require fibjs >= 0.26.0
 */
const vm = require('vm')
const fs = require('fs')
const path = require('path')

const fibTypify = require('../')
const UTILs = require('./_utils')

function generateLoaderbox (tsCompilerOptions, basedir = __dirname) {
    const withCustomLoaderFunction = UTILs.isWithCustomLoaderFunction()

    const tsSandbox = new vm.SandBox(UTILs.builtModules)
    let hackedRequireFn = tsSandbox.require.bind(tsSandbox)

    if (withCustomLoaderFunction) {
        UTILs.registerTsCompiler(tsSandbox)
    } else { // compat old version
        let __orig_require = hackedRequireFn

        hackedRequireFn = function (...args) {
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

            fibTypify.compileFileToSandBox(tsfilepath, {
                sandbox: tsSandbox,
                moduleName: tsfilepath
            }, tsCompilerOptions)

            return __orig_require(tsfilepath, _basedir)
            // return tsSandbox.require(tsfilepath, _basedir)
        }

        tsSandbox.require = hackedRequireFn.bind(tsSandbox)
    }

    return tsSandbox
}

exports.generateLoaderbox = generateLoaderbox
exports.defaultBox = generateLoaderbox()
