const fs = require('fs')
const path = require('path')
const vm = require('vm')

const { getTranspilor } = require('../ts-apis/transpilor')
const CORE = require('../core')
const UTILs = require('../_utils')

exports.compileRaw = function (tsRaw = '', tsCompilerOptions, filename, diagnostics, moduleName) {
    return getTranspilor(tsCompilerOptions, filename, diagnostics, moduleName)(tsRaw)
}

exports.compileRawToFile = function (tsRaw = '', targetpath = '', tsCompilerOptions) {
    if (fs.exists(targetpath)) {
        const tstat = fs.stat(targetpath)
        if (tstat.isDirectory()) {
            console.warn(`${UTILs.getLogPrefix('api', 'compileRawToFile')}targetpath '${targetpath}' is one directory but expected as one file.`)
            return
        } else if (tstat.isFile()) {
            // ONLY FOR DEBUG
            UTILs.isDebug && console.debug(`${UTILs.getLogPrefix('api', 'compileRawToFile')}file '${targetpath}' has existed, try to overwrite it.`)
        }
    }

    const basedir = path.dirname(targetpath)
    if (!fs.exists(basedir)) {
        try {
            UTILs.mkdirp(basedir)
        } catch (e) {
            console.warn(`${UTILs.getLogPrefix('api', 'mkdirp')}error occured when trying to mkdirp ${basedir}`)
            return
        }
    }

    const resultString = exports.compileRaw(tsRaw, tsCompilerOptions)
    fs.writeTextFile(targetpath, resultString)
}

function noop () {}
/**
 * @deprecated
 */
exports.compileRawToSandBox = function (tsRaw = '', sboxOpts, tsCompilerOptions) {
    const compiledString = exports.compileRaw(tsRaw, tsCompilerOptions)
    const { sboxName, sboxFallback = noop, moduleName = sboxName } = sboxOpts || {}
    let { sandbox = null } = sboxOpts || {}

    if (!sandbox) {
        if (!sboxName) {
            throw `${UTILs.getLogPrefix('api', 'compileRawToSandBox')}'sandbox' or 'sboxName' is required for 'sboxOpts'`
        }
        sandbox = new vm.SandBox({}, sboxFallback)
    }

    sandbox.addScript(moduleName, new Buffer(compiledString))
    return sandbox
}
