const fs = require('fs')
const path = require('path')
const util = require('util')

const mkdirp = require('@fibjs/mkdirp')

const { filterCompilerOptions } = require('./ts-apis/compilerOptions')
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

exports.defaultCompilerOptions = require('../tsconfig.dft.json')

exports.getCwdTsCompilerOptions = function () {
    return exports.extendCompilerConfigFromTSConfig(util.extend({}, exports.defaultCompilerOptions))
}

const TS_SUFFIX = exports.TS_SUFFIX = '.ts'
const SOURCEMAP_SUFFIX = exports.SOURCEMAP_SUFFIX = '.map'

exports.builtModules = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()
exports.defaultSandboxFallback = function (name) {
    return require(name)
}

const compileModule = require('./transpile/module').compileModule
const defaultSourceMapInstallScriptName = exports.defaultSourceMapInstallScriptName = path.resolve(__dirname, './runtime/source-map-install.js')

const saveCacheMap = function (filename, mapContent) {
    const io = require('io')
    const zip = require('zip')

    const stream = new io.MemoryStream();
    const zipfile = zip.open(stream, "w");
    zipfile.write(new Buffer(mapContent), 'index.map');
    zipfile.close();

    stream.rewind();
    fs.setZipFS(`${filename}.zip`, stream.readAll());
}

const LINE_MARKER = '//# sourceMappingURL=';
exports.registerTsCompiler = (
    sandbox,
    tsCompilerOptions = exports.getCwdTsCompilerOptions(),
    moduleOptions = {},
    sourceMapConfig
) => {
    const {
        sourceMapInstallScriptFilename = defaultSourceMapInstallScriptName,
        sourceMapInstallScript = ''
    } = sourceMapConfig || {}

    moduleOptions.compilerOptions = util.extend({}, tsCompilerOptions, moduleOptions.compilerOptions)

    filterCompilerOptions(moduleOptions.compilerOptions)

    if (moduleOptions.compilerOptions.inlineSourceMap) {
        // sandbox.setModuleCompiler(SOURCEMAP_SUFFIX, buf => buf + '')
        if (sourceMapInstallScript)
            sandbox.add('source-map-install.js', sourceMapInstallScript)
        else if (sourceMapInstallScriptFilename && fs.exists(sourceMapInstallScriptFilename))
            sandbox.require(sourceMapInstallScriptFilename, __dirname)
    }

    ;[
        TS_SUFFIX,
        '.tsx'
    ].forEach(tsSuffix => {
        sandbox.setModuleCompiler(tsSuffix, (buf, args) => {
            const compiledModule = compileCallback(buf, args, moduleOptions)

            if (moduleOptions.compilerOptions.inlineSourceMap) {
                const sourceMapURL = compiledModule.outputText.slice(
                    compiledModule.outputText.lastIndexOf(LINE_MARKER), -1
                )
                saveCacheMap(args.filename, LINE_MARKER + sourceMapURL)
                // sandbox.add(args.filename + SOURCEMAP_SUFFIX, sourceMapURL)
            }

            return compiledModule.outputText
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

function compileCallback (buf, args, moduleOptions) {
   let tsScriptString = buf + ''

    if (!tsScriptString) return undefined

    const compiledModule = compileModule(tsScriptString, {
        ...moduleOptions,
        fileName: args.filename,
        moduleName: args.filename
    })
    return compiledModule
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
