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

const { compileModule } = require('./module')
const defaultSourceMapInstallScriptName = exports.defaultSourceMapInstallScriptName = path.resolve(__dirname, './runtime/source-map-install.js')

exports.registerTsCompiler = (
    sandbox,
    tsCompilerOptions = exports.getCwdTsCompilerOptions(),
    sourceMapConfig
) => {
    const {
        __sourceMapBox = new vm.SandBox({}),
        sourceMapInstallScriptFilename = defaultSourceMapInstallScriptName,
        sourceMapInstallScript = ''
    } = sourceMapConfig || {}

    __sourceMapBox.setModuleCompiler(TS_SUFFIX, (buf) => buf + '')

    CORE._filterCompilerOptions(tsCompilerOptions)
    if (tsCompilerOptions.inlineSourceMap) {
        sandbox.add('__sourceMapBox', __sourceMapBox)
        if (sourceMapInstallScript)
            sandbox.add('', sourceMapInstallScript)
        else if (sourceMapInstallScriptFilename && fs.exists(sourceMapInstallScriptFilename))
            sandbox.require(sourceMapInstallScriptFilename, __dirname)
    }

    sandbox.setModuleCompiler(TS_SUFFIX, (buf, args) => {
        const compiledModule = compileCallback(buf, args, tsCompilerOptions)

        if (tsCompilerOptions.inlineSourceMap) {
            __sourceMapBox.add(args.filename, compiledModule.outputText)
        }

        return `${compiledModule.outputText}`
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

function compileCallback (buf, args, tsCompilerOptions) {
   let tsScriptString = buf + ''
   tsScriptString = exports.fixTsRaw(tsScriptString)

    if (!tsScriptString) return undefined

    const compiledModule = compileModule(tsScriptString, {
        compilerOptions: tsCompilerOptions,
        fileName: args.filename,
        moduleName: args.filename
    })

    return compiledModule
}
