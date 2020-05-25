#!/usr/bin/env fibjs
'use strict';

const fs = require('fs')
const path = require('path')
const util = require('util')

const pkgJson = require('../package.json')

const argFlags = require('./utils/arg_flags')
const errCode = require('./utils/err_code')

const replaceSuffix = require('../core/_utils').replaceSuffix

const { compileDirectoryTo } = require('../core/transpile/fs-directory')
const { generateLoaderbox } = require('../core/loader-box')
const { createCompilerHost } = require('../core/ts-apis/program')
const { resolveCwdTsProject } = require('../core/ts-apis/compilerOptions')
const defaultCompilerOptions = require('../core/_utils').defaultCompilerOptions

const cli = require('@fxjs/cli')('fib-typify')

cli
    .command('[...files]', 'source file')
    .option('-c, --config-file <configFile>', 'tsconfig.json path', {
        default: path.resolve(process.cwd(), './tsconfig.json')
    })
    .option('-o, --out [target]', 'output target', {})
    .action(function (files, options) {
        const [srcpath] = files

        const outputValue = typeof options.o === 'string' ? options.o : ''
        const outputExisted = getArgIdxFromArgs(cli.rawArgs, argFlags.output) > -1

        let tsCompilerOptions = JSON.parse(JSON.stringify(defaultCompilerOptions))
        if (!tsCompilerOptions.outDir && outputValue) {
            tsCompilerOptions.outDir = outputValue
        }

        if (!tsCompilerOptions.outDir) {
            tsCompilerOptions.noEmit = true
            tsCompilerOptions.declaration = false
            tsCompilerOptions.sourceMap = false
            tsCompilerOptions.inlineSourceMap = false
        }

        const CWD = process.cwd()

        const parsedTsConfig = resolveCwdTsProject(options.c, { compilerHost: createCompilerHost(tsCompilerOptions), cwd: CWD })
        if (parsedTsConfig.errors.length)
            // TODO: test it
            throw new Error(parsedTsConfig.errors[0])
            
        tsCompilerOptions = parsedTsConfig.options
        
        is_debug() && console.notice('tsCompilerOptions', tsCompilerOptions);

        const topTsSandbox = generateLoaderbox(tsCompilerOptions)
        is_debug() && console.notice('tsCompilerOptions.outDir', tsCompilerOptions.outDir)

        // finalParams
        const entryPoint = resolveExistedEntry(topTsSandbox, srcpath, CWD)

        if (outputExisted) {
            // compile mode
            const baseDir = path.resolve(CWD, srcpath)
            const distDir = path.resolve(CWD, outputValue || replaceSuffix(srcpath))

            if (!fs.exists(baseDir)) {
                quit(errCode["invalidArg:input"], 1)
            }

            compileDirectoryTo(baseDir, distDir, { compilerOptions: tsCompilerOptions })
        } else if (entryPoint) {
            // run mode
            topTsSandbox.require(entryPoint, __dirname)
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
    console.log('configFilePath', configFilePath);

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
