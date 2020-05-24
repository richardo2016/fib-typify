const fs = require('fs')
const path = require('path')
const util = require('util')

const mkdirp = require('@fibjs/mkdirp')

const { filterCompilerOptions } = require('./ts-apis/compilerOptions')
const CORE = require('./core')

const { createCompilerHostForSandboxRegister } = require('./vm/sandbox')
const { createProgram } = require('./ts-apis/program')

function time () {
    return new Date()
}
const isDebug = exports.isDebug = !!process.env.FIB_DEBUG

exports.mkdirp = (...args) => {
    isDebug && console.log(`${getLogPrefix('io', 'mkdirp')}`)
    return mkdirp(...args)
}

exports.overwriteFile = (srcpath, distpath) => {
    if (fs.exists(distpath)) {
        const stat = fs.stat(distpath)

        if (stat.isDirectory()) {
            rmdirr(distpath)
        } else {
            fs.unlink(distpath)
        }
    }

    fs.copy(srcpath, distpath)
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

exports.defaultCompilerOptions = require('../tsconfig.dft.json')

exports.getCwdTsCompilerOptions = function () {
    return exports.extendCompilerConfigFromTSConfig(util.extend({}, exports.defaultCompilerOptions))
}

const TS_SUFFIX = exports.TS_SUFFIX = '.ts'

exports.builtModules = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

exports.registerTsCompiler = (
    sandbox,
    tsCompilerOptions = {},
    moduleOptions = {},
) => {
    moduleOptions.compilerOptions = util.extend({}, tsCompilerOptions, moduleOptions.compilerOptions)

    filterCompilerOptions(moduleOptions.compilerOptions)
    const { host, getByFilename } = createCompilerHostForSandboxRegister(tsCompilerOptions)

    ;[
        TS_SUFFIX,
        '.tsx'
    ].forEach(tsSuffix => {
        sandbox.setModuleCompiler(tsSuffix, (buf, args) => {
            const filename = path.normalize(args.filename)
            let result = getByFilename(filename)
            if (!result) {
                const program = createProgram([ filename ], {
                    ...tsCompilerOptions,
                }, host)
    
                program.emit()
                
                result = getByFilename(filename)
            }

            return result
        })
    })
}

exports.fixTsRaw = function (tsRaw) {
    if (typeof tsRaw !== 'string')
        throw 'tsRaw must be string!'

    if (tsRaw.length > 2 && tsRaw.indexOf('#!') === 0) {
        tsRaw = '//' + tsRaw;
    }

    return tsRaw
}

exports.replaceSuffix = function (target = '', {
    to_replace = /.tsx?$/,
    replace_to = '.js'
} = {}) {
    if (!target) return target

    if (to_replace === 'string')
        to_replace = new RegExp(`${to_replace}$`)

    return target.replace(to_replace, replace_to)
}

exports.fixNonAbsolutePath = function (input, basedir) {
    return path.isAbsolute(input) ? input : path.resolve(basedir, input)
}
