#!/usr/bin/env fibjs

const isDebug = !!process.env.FIB_TYPIFY_DEBUG

isDebug && console.log(process.argv)

const fs = require('fs')
const path = require('path')
const util = require('util')

const argFlags = require('./utils/arg_flags')
const errCode = require('./utils/err_code')

const fibTypify = require('..')

const cwd = process.cwd()
isDebug && console.log('cwd', cwd)

const [
    _1, _2,
    srcpath,
    ...args
] = process.argv || []

const finalParams = {cwd, srcpath}

finalParams.outputDir = getParamFromArgs(args, argFlags.output)
isDebug && console.log('finalParams.outputDir', finalParams.outputDir)

if (!finalParams.outputDir) {
    console.error(errCode["noArg:output"])
    process.exit(-1)
}

/* run :start */
const baseDir = path.resolve(cwd, srcpath)
const distDir = path.resolve(cwd, finalParams.outputDir)

let tsCompilerOptions = {
    target: 'es6',
    module: 'commonjs'
}
finalParams.configFilepath = getParamFromArgs(args, ['-c', '--config-file'])
let configFilepath = finalParams.configFilepath ? path.resolve(baseDir, finalParams.configFilepath) : null
if (configFilepath && fs.exists(configFilepath)) {
    let config = {}
    try {
        config = JSON.parse(fs.readTextFile(configFilepath))
    } catch (e) {
        console.warn(`error occured when trying to parse config file: ${configFilepath}`)
    }
    tsCompilerOptions = util.extend({}, tsCompilerOptions, config)
}

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

