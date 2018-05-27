const fs = require('fs')
const path = require('path')
const vm = require('vm')
const mkdirp = require('@fibjs/mkdirp')

const compileRaw = require('./raw')
const compileFile = require('./fs-file')

const _includeExts = ['.ts']
const _excludeExts = ['.d.ts']
function filterFilenameByExt (
    filename = '',
    includeExts = [],
    excludeExts = []
) {
    const valid = includeExts.every(ext => {
        return filename.lastIndexOf(ext) === filename.length - ext.length
    })

    const invalid = excludeExts.some(ext => {
        return filename.lastIndexOf(ext) === filename.length - ext.length
    })

    return valid && !invalid
}

function _getFilenameFilter (includeExts = _includeExts, excludeExts = _excludeExts) {
    return (filename) => filterFilenameByExt(filename, includeExts, excludeExts)
}

exports.compileTo = function (baseDir, distDir, compileDirToOpts) {
    const fileNameList = fs.readdir(baseDir)
    if (!fs.exists(distDir)) {
        mkdirp(distDir)
    }
    const {
        filterFileName = _getFilenameFilter()
    } = compileDirToOpts || {}

    fileNameList.forEach((filename) => {
        const fullspath = path.resolve(baseDir, filename)

        const stat = fs.stat(fullspath)
        if (stat.isDirectory()) {
            exports.compileTo(
                fullspath,
                path.resolve(distDir, filename),
                compileDirToOpts
            )
            return
        } else if (!stat.isFile()) {
            return
        }

        if (!filterFileName(filename)) {
            return
        }

        const tbasename = filename.replace('.ts', '.js')
        const tpath = path.join(distDir, tbasename)

        compileFile.compileTo(fullspath, tpath)
    })
}
