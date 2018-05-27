const fs = require('fs')
const path = require('path')
const vm = require('vm')
const mkdirp = require('@fibjs/mkdirp')

const typescript = require('typescript')

const CORE = require('./core')

exports.compile = function (tsRaw = '', rawCompileOpts) {
    return CORE._getTranspilor(rawCompileOpts)(tsRaw)
}

exports.compileToFile = function (tsRaw = '', targetpath = '', rawCompileOpts) {
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

    const resultString = exports.compile(tsRaw, rawCompileOpts)
    fs.writeTextFile(targetpath, resultString)
}

function noop () {}
exports.compileToSandBox = function (tsRaw = '', sboxOpts, rawCompileOpts) {
    const compiledString = exports.compile(tsRaw, rawCompileOpts)
    const { sboxName, sboxFallback = noop } = sboxOpts || {}

    const sbox = new vm.SandBox({}, sboxFallback)

    if (!sboxName) {
        throw `${CORE.logPrefix}'sboxName' is required for 'sboxOpts'`
    } else {
        sbox.addScript(sboxName, new Buffer(compiledString))
    }
    return sbox
}
