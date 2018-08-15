const fs = require('fs')
const path = require('path')

const CORE = require('./core')
const fibTypify = require('../')

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

function fixTsRaw (tsRaw) {
    if (typeof tsRaw !== 'string')
        throw 'tsRaw must be string!'

    if (tsRaw.length > 2 && tsRaw.indexOf('#!') === 0) {
        tsRaw = '//' + tsRaw;
    }

    return tsRaw
}

exports.compileFile = function (filepath = '', tsCompilerOptions) {
    _checkSrcFilepath(filepath)

    let tsRaw = fs.readTextFile(filepath)
    if (!tsRaw)
        throw `${UTILs.getLogPrefix('api', 'compileFile')}filecontent is empty`
    tsRaw = fixTsRaw(tsRaw)

    return CORE._getTranspilor(tsCompilerOptions)(tsRaw)
}

exports.compileFileTo = function (srcpath = '', targetpath = '', tsCompilerOptions) {
    _checkSrcFilepath(srcpath)

    const sbasename = path.basename(srcpath)
    if (!sbasename) {
        throw `${CORE.logPrefix} 'srcpath' is not valid path to one file`
    }

    if (fs.exists(targetpath)) {
        const tstat = fs.stat(targetpath)
        if (tstat.isDirectory()) {
            targetpath = path.join(targetpath, sbasename)
        }
    }

    let tsRaw = fs.readTextFile(srcpath)
    if (!tsRaw)
        throw `${UTILs.getLogPrefix('api', 'compileFileTo')}filecontent is empty`
    tsRaw = fixTsRaw(tsRaw)

    return fibTypify.compileRawToFile(tsRaw, targetpath, tsCompilerOptions)
}

exports.compileFileToSandBox = function (srcpath = '', sboxOpts, tsCompilerOptions) {
    _checkSrcFilepath(srcpath)

    let tsRaw = fs.readTextFile(srcpath)
    if (!tsRaw)
        throw `${UTILs.getLogPrefix('api', 'compileFileToSandBox')}filecontent is empty`
    tsRaw = fixTsRaw(tsRaw)

    return fibTypify.compileRawToSandBox(tsRaw, sboxOpts, tsCompilerOptions)
}
