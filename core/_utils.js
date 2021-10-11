const fs = require('fs')
const path = require('path')

const mkdirp = (target) => {
    try {
        if (!fs.exists(target)) {
            fs.mkdir(target)
        }
    } catch (error) {
        mkdirp(path.dirname(target));

        try {
            fs.mkdir(target)
        } catch (error) {}
    }
}

exports.mkdirp = mkdirp;

const readdirr = require('@fibjs/fs-readdir-recursive')

const CORE = require('./core')

const { compileModule } = require('./transpile/module')

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

    // old fibjs version
    if (fs.copy) {
        fs.copy(srcpath, distpath)
    } else {
        fs.copyFile(srcpath, distpath)
    }
}

exports.getLogPrefix = function getLogPrefix (domain = 'default', action = 'action') {
    return `${CORE.logPrefix}[${domain}:${action}] - [${time()}]  `
}

exports.defaultCompilerOptions = require('../tsconfig.dft.json').compilerOptions

exports.builtModules = require('@fibjs/builtin-modules/lib/util/get-builtin-module-hash')()

const TS_SUFFIX = exports.TS_SUFFIX = '.ts'

const SOURCEMAP_RUNTIME_SCRIPT = path.resolve(__dirname, './runtime/source-map-install.js')
const LINE_MARKER = '//# sourceMappingURL=';

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

exports.registerTsCompiler = (
    sandbox,
    tsCompilerOptions = {},
) => {
    const useSourceMap = tsCompilerOptions.inlineSourceMap || tsCompilerOptions.sourceMap
    const inlineSourceMap = tsCompilerOptions.inlineSourceMap;

    if (useSourceMap)
        sandbox.require(SOURCEMAP_RUNTIME_SCRIPT, __dirname)

    ;[
        TS_SUFFIX,
        '.tsx'
    ].forEach(tsSuffix => {
        sandbox.setModuleCompiler(tsSuffix, (buf, args) => {
            const compiledModule = compileCallback(buf, args, {
                compilerOptions: {...tsCompilerOptions, sourceMap: false, inlineSourceMap: true }
            })

            if (inlineSourceMap) {
                const sourceMapDataURL = compiledModule.outputText.slice(
                    compiledModule.outputText.lastIndexOf(LINE_MARKER), -1
                )
                saveCacheMap(args.filename, LINE_MARKER + sourceMapDataURL)
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

/**
 *
 * @param {Class_Buffer} buf
 * @param {{
 *  filename: string
 * }} args
 * @param {import('typescript').TranspileOptions} moduleOptions
 * @returns
 */
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

exports.fixNonAbsolutePath = function (input, basedir) {
    return path.isAbsolute(input) ? input : path.resolve(basedir, input)
}

exports.getCwdFilenamesR = function getCwdFilenamesR({
    cwd = process.cwd(),
    allowNodeModules = false
} = {}) {
    return readdirr(cwd, x => {
        if (!allowNodeModules && x.startsWith('node_modules')) return false

        if (x[0] !== '.') return true
    })
}
