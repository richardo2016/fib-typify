const fs = require('fs')
const path = require('path')
const mkdirp = require('@fibjs/mkdirp')

const CORE = require('./core')
const compileRaw = require('./raw')

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

exports.compile = function (filepath = '', tsCompilerOptions) {
    _checkSrcFilepath(filepath)

    const tsRaw = fs.readTextFile(filepath)
    return CORE._getTranspilor(tsCompilerOptions)(tsRaw)
}

exports.compileTo = function (srcpath = '', targetpath = '', tsCompilerOptions) {
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

    const tsRaw = fs.readTextFile(srcpath)
    compileRaw.compileToFile(tsRaw, targetpath, tsCompilerOptions)
}

exports.compileToSandBox = function (srcpath = '', sboxOpts, tsCompilerOptions) {
    _checkSrcFilepath(srcpath)

    const tsRaw = fs.readTextFile(srcpath)

    return compileRaw.compileToSandBox(tsRaw, sboxOpts, tsCompilerOptions)
}
