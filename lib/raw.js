const fs = require('fs')
const path = require('path')
const vm = require('vm')
const mkdirp = require('@fibjs/mkdirp')

const typescript = require('typescript')

const CORE = require('./core')

exports.compile = function (tsRaw = '', tsCompilerOptions) {
    return CORE._getTranspilor(tsCompilerOptions)(tsRaw)
}

exports.compileToFile = function (tsRaw = '', targetpath = '', tsCompilerOptions) {
    if (fs.exists(targetpath)) {
        const tstat = fs.stat(targetpath)
        if (tstat.isDirectory()) {
            console.warn(`${CORE.logPrefix}targetpath '${targetpath}' is one directory but expected as one file.`)
            return
        } else if (tstat.isFile()) {
            // ONLY FOR DEBUG
            console.debug(`${CORE.logPrefix}file '${targetpath}' has existed, try to overwrite it.`)
        }
    }

    const basedir = path.dirname(targetpath)
    if (!fs.exists(basedir)) {
        try {
            mkdirp(basedir)
        } catch (e) {
            console.warn(`${CORE.logPrefix}error occured when trying to mkdirp ${basedir}`)
            return
        }
    }

    const resultString = exports.compile(tsRaw, tsCompilerOptions)
    fs.writeTextFile(targetpath, resultString)
}

function noop () {}
exports.compileToSandBox = function (tsRaw = '', sboxOpts, tsCompilerOptions) {
    const compiledString = exports.compile(tsRaw, tsCompilerOptions)
    const { sboxName, sboxFallback = noop } = sboxOpts || {}

    const sbox = new vm.SandBox({}, sboxFallback)

    if (!sboxName) {
        throw `${CORE.logPrefix}'sboxName' is required for 'sboxOpts'`
    } else {
        sbox.addScript(sboxName, new Buffer(compiledString))
    }
    return sbox
}
