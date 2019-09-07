const fs = require('fs')
const path = require('path')
const mm = require('micromatch')

const compileFile = require('./fs-file')
const UTILs = require('./_utils')

const _includeExts = ['.ts', '.tsx']
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

const DOT = '.'
function _assertExt (extName) {
    if (!extName || extName[0] !== DOT) {
        throw `${extName} is not valid extension`
    }

    return true
}

function _getCopyWhiteListViaGlobrule (globRules = []) {
    return function _handler ({
        baseDir, distDir, filename
    }) {
        const srcpath = path.resolve(baseDir, filename)

        const [_filename] = mm([filename], globRules)
        const distpath = path.resolve(distDir, _filename)
        if (_filename) {
            UTILs.overwriteFile(srcpath, distpath)
        }
    }
}

const DEFAULT_FILEGLOB_TO_COPY = ['*.js', '*.jsc', '*.json']
const DEFAULT_INCLUDE_GLOB_LIST = ['*', '!node_modules', '!.ts', '!.tsx']

exports.compileDirectoryTo = function (baseDir, distDir, directoryCompilationOptions) {
    const {
        filterFileName = _getFilenameFilter(),
        fileglobsToCopy = DEFAULT_FILEGLOB_TO_COPY,
        includeLeveledGlobs = DEFAULT_INCLUDE_GLOB_LIST,
        compilerOptions = null
    } = directoryCompilationOptions || {}

    if (fs.exists(baseDir) && fs.stat(baseDir).isFile()) {
        let tpath = distDir
        if (baseDir === tpath)
            tpath = undefined

        if (!tpath)
            tpath = UTILs.replaceSuffix(baseDir)

        return compileFile.compileFileTo(baseDir, tpath, compilerOptions)
    }

    if (!fs.exists(distDir)) {
        UTILs.mkdirp(distDir)
    }

    const blobNameList = fs.readdir(baseDir)

    /* deal with old api :start */
    const _onFile = _getCopyWhiteListViaGlobrule(fileglobsToCopy)

    const filteredBlobNameList = mm(blobNameList, includeLeveledGlobs)

    filteredBlobNameList.forEach((blobname) => {
        const fullspath = path.resolve(baseDir, blobname)

        const stat = fs.stat(fullspath)
        if (stat.isDirectory()) {
            exports.compileDirectoryTo(
                fullspath,
                path.resolve(distDir, blobname),
                directoryCompilationOptions
            )
            return
        } else if (!stat.isFile())
            return

        _onFile({
            baseDir,
            distDir,
            filename: blobname
        })

        if (!filterFileName(blobname))
            return

        const tbasename = UTILs.replaceSuffix(blobname)
        const tpath = path.join(distDir, tbasename)

        compileFile.compileFileTo(fullspath, tpath, compilerOptions)
    })
}
