const fs = require('fs')
const path = require('path')
const util = require('util')

const CORE = require('./core')
const raw = require('./raw')
const UTILs = require('./_utils')

function _checkSrcFilepath (filepath) {
    if (!fs.exists(filepath)) {
        throw `invalid filepath ${filepath}`
    }
    const stat = fs.stat(filepath)

    if (!stat.isFile()) {
        throw `path '${filepath}' is not one file`
    }

    return stat
}


exports.compileFile = function (filepath = '', tsCompilerOptions) {
    _checkSrcFilepath(filepath)

    let tsRaw = fs.readTextFile(filepath)
    if (!tsRaw) {
        if (UTILs.isDebug) {
            throw `${UTILs.getLogPrefix('api', 'compileFile')}filecontent is empty in ${filepath}`
        }
        tsRaw = ''
    }

    return CORE._getTranspilor(tsCompilerOptions)(tsRaw)
}

exports.compileFileTo = function (filepath = '', targetpath = '', tsCompilerOptions) {
    _checkSrcFilepath(filepath)

    const sbasename = path.basename(filepath)
    if (!sbasename) {
        throw `${CORE.logPrefix} 'filepath' is not valid path to one file`
    }

    if (fs.exists(targetpath) && fs.stat(targetpath).isDirectory()) {
        targetpath = path.join(targetpath, sbasename)
    }

    let tsRaw = fs.readTextFile(filepath)
    if (!tsRaw) {
        if (UTILs.isDebug) {
            throw `${UTILs.getLogPrefix('api', 'compileFileTo')}filecontent is empty in ${filepath}`
        }
        tsRaw = ''
    }

    return raw.compileRawToFile(tsRaw, targetpath, tsCompilerOptions)
}

/**
 * @deprecated
 */
exports.compileFileToSandBox = function (filepath = '', sboxOpts, tsCompilerOptions) {
    _checkSrcFilepath(filepath)

    let tsRaw = fs.readTextFile(filepath)
    if (!tsRaw) {
        if (UTILs.isDebug) {
            throw `${UTILs.getLogPrefix('api', 'compileFileToSandBox')}filecontent is empty in ${filepath}`
        }
        tsRaw = ''
    }

    return raw.compileRawToSandBox(tsRaw, util.extend({
        moduleName: filepath,
    }, sboxOpts), tsCompilerOptions)
}
