#!/usr/bin/env fibjs

const isDebug = !!process.env.FIB_TYPIFY_DEBUG

isDebug && console.log(process.argv)

const fs = require('fs')
const path = require('path')
const util = require('util')

const argFlags = require('./utils/arg_flags')
const errCode = require('./utils/err_code')

const extendCompilerConfigFromTSConfig= require('../lib/_utils').extendCompilerConfigFromTSConfig
let tsCompilerOptions = JSON.parse(JSON.stringify(require('../lib/_utils').defaultCompilerOptions))

const fibTypify = require('..')

const cwd = process.cwd()
isDebug && console.log('cwd', cwd)

const [
    _1, _2,
    srcpath,
    ...args
] = process.argv || []

const finalParams = {cwd, srcpath}

/* collect params :start */
function mergeCompilerConfigFromCustomConfig (configFilepath = null, origConfig = {}) {
    configFilepath = configFilepath ? path.resolve(cwd, configFilepath) : null

    if (configFilepath && fs.exists(configFilepath)) {
        let config = {}
        if (['.json', '.js', '.jsc'].some(ext => configFilepath.endsWith(ext))) {
            config = require(configFilepath)
            isDebug && console.log('internal extension', config)
        } else {
            try {
                config = JSON.parse(fs.readTextFile(configFilepath))
            } catch (e) {
                console.warn(`error occured when trying to parse config file: ${configFilepath}`)
            }
        }

        origConfig = util.extend({}, origConfig, config)
    }
    return origConfig
}

tsCompilerOptions = mergeCompilerConfigFromCustomConfig(getParamFromArgs(args, ['-c', '--config-file']), tsCompilerOptions)
tsCompilerOptions = extendCompilerConfigFromTSConfig(tsCompilerOptions)
/* collect params :end */

tsCompilerOptions.outDir = tsCompilerOptions.outDir || getParamFromArgs(args, argFlags.output)
isDebug && console.log('tsCompilerOptions.outDir', tsCompilerOptions.outDir)

if (!tsCompilerOptions.outDir) {
    console.error(errCode["noArg:output"])
    process.exit(-1)
}

/* run :start */
const baseDir = path.resolve(cwd, srcpath)
const distDir = path.resolve(cwd, tsCompilerOptions.outDir)

isDebug && console.log('finalParams', finalParams)
isDebug && console.log('tsCompilerOptions', tsCompilerOptions);

fibTypify.compileDirectoryTo(baseDir, distDir, {
    compilerOptions: tsCompilerOptions
})
/* run :end */

function getParamFromArgs (args = [], optFlags = []) {
    if (!Array.isArray(optFlags)) {
        optFlags = [optFlags]
    }
    isDebug && console.log('optFlags', optFlags, args)

    const argIndex = args.findIndex(x => optFlags.includes(x))
    return argIndex >= 0 ? args[argIndex + 1] : null
}

