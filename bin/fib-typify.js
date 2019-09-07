#!/usr/bin/env fibjs

const fs = require('fs')
const path = require('path')
const util = require('util')

const pkgJson = require('../package.json')

const argFlags = require('./utils/arg_flags')
const errCode = require('./utils/err_code')

const extendCompilerConfigFromTSConfig = require('../core/_utils').extendCompilerConfigFromTSConfig
const replaceSuffix = require('../core/_utils').replaceSuffix

const { compileDirectoryTo } = require('../core/fs-directory')
const { generateLoaderbox } = require('../core/loader-box')
const defaultCompilerOptions = require('../core/_utils').defaultCompilerOptions

const cli = require('@fxjs/cli')(pkgJson.name)

cli
    .command('[...files]', 'source file')
    .option('-c, --config-file <configFile>', 'tsconfig.json path', {
        default: path.resolve(process.cwd(), './tsconfig.json')
    })
    .option('-o, --out [target]', 'output target', {})
    // .command('compile [...compileSource]', 'source files to compile')
    .action(function (files, options) {
        const [srcpath] = files

        const outputValue = typeof options.o === 'string' ? options.o : ''
        const outputExisted = getArgIdxFromArgs(cli.rawArgs, argFlags.output) > -1

        let tsCompilerOptions = JSON.parse(JSON.stringify(defaultCompilerOptions))
        const cwd = process.cwd()

        /* collect params :start */
        tsCompilerOptions = mergeCompilerConfigFromCustomConfig(options.c, tsCompilerOptions, cwd)
        tsCompilerOptions = extendCompilerConfigFromTSConfig(tsCompilerOptions)
        tsCompilerOptions.outDir = tsCompilerOptions.outDir || outputValue
        is_debug() && console.notice('tsCompilerOptions', tsCompilerOptions);
        /* collect params :end */

        const topTsSandbox = generateLoaderbox(tsCompilerOptions)
        is_debug() && console.notice('tsCompilerOptions.outDir', tsCompilerOptions.outDir)

        // finalParams
        const fP = {
            cwd,
            srcpath,
            entryPoint: resolveExistedEntry(topTsSandbox, srcpath, cwd)
        }
        is_debug() && console.notice('finalParams', fP)

        if (outputExisted) {
            // compile mode
            const baseDir = path.resolve(fP.cwd, fP.srcpath)
            const distDir = path.resolve(fP.cwd, outputValue || replaceSuffix(fP.srcpath))

            if (!fs.exists(baseDir)) {
                quit(errCode["invalidArg:input"], 1)
            }

            compileDirectoryTo(baseDir, distDir, { compilerOptions: tsCompilerOptions })
        } else if (fP.entryPoint) {
            // run mode
            topTsSandbox.require(fP.entryPoint, __dirname)
        } else
            quit(errCode["noArg:output"], 1)
    })

cli.help()
cli.version(pkgJson.version)

cli.parse()

function is_debug () {
    return !!process.env.FIB_TYPIFY_DEBUG
}

function quit (error_msg, code = -1) {
    console.error(error_msg)
    process.exit(code)
}

function mergeCompilerConfigFromCustomConfig (configFilePath = null, origConfig = {}, cwd) {
    configFilePath = configFilePath ? path.resolve(cwd, configFilePath) : null

    if (configFilePath && fs.exists(configFilePath)) {
        let config = {}
        if (['.json', '.js', '.jsc'].some(ext => configFilePath.endsWith(ext))) {
            config = require(configFilePath)
            is_debug() && console.notice('internal extension', config)
        } else {
            try {
                config = JSON.parse(fs.readTextFile(configFilePath))
            } catch (e) {
                console.warn(`error occured when trying to parse config file: ${configFilePath}`)
            }
        }

        origConfig = util.extend({}, origConfig, config)
    }
    return origConfig
}

function resolveExistedEntry (vbox, entryPoint, cwd = __dirname) {
    // always allow existed file
    if (entryPoint && fs.exists(entryPoint) && fs.stat(entryPoint).isFile())
        return vbox.resolve(entryPoint, cwd);

    let existed = null
    try {
        existed = vbox.resolve(entryPoint, cwd)
    } catch (e) {
        existed = null
    }
    return existed
}

function getArgIdxFromArgs (args = [], optFlags = []) {
    if (!Array.isArray(optFlags)) {
        optFlags = [optFlags]
    }
    is_debug() && console.log('optFlags', optFlags, args)

    const argIndex = args.findIndex(x => optFlags.includes(x))
    return argIndex
}
