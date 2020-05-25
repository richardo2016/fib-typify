const fs = require('fs')
const path = require('path')
const util = require('util')

const mkdirp = require('@fibjs/mkdirp')

const CORE = require('./core')

const { getInternalVMTSFilename, createCompilerHostForSandboxRegister } = require('./vm/sandbox')
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

exports.defaultCompilerOptions = require('../tsconfig.dft.json').compilerOptions

const TS_SUFFIX = exports.TS_SUFFIX = '.ts'

exports.builtModules = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

exports.registerTsCompiler = (
    sandbox,
    tsCompilerOptions = {},
) => {
    const host = createCompilerHostForSandboxRegister(tsCompilerOptions, sandbox)

    ;[
        TS_SUFFIX,
        '.tsx'
    ].forEach(tsSuffix => {
        sandbox.setModuleCompiler(tsSuffix, (buf, args) => {
            const tsFilename = path.normalize(args.filename)
            const vmtsFilename = getInternalVMTSFilename(tsFilename)

            if (!sandbox.has(vmtsFilename)) {
                const program = createProgram([ tsFilename ], {
                    ...tsCompilerOptions,
                }, host)
    
                program.emit()
            }

            return sandbox.require(vmtsFilename, __dirname).js
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
