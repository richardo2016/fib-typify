const fs = require('fs')
const path = require('path')
const mm = require('micromatch')
const rmdirr = require('@fibjs/rmdirr')

const compileFile = require('./fs-file')
const UTILs = require('./_utils')

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

const DOT = '.'
function _assertExt (extName) {
    if (!extName || extName[0] !== DOT) {
        throw `${extName} is not valid extension`
    }

    return true
}

function _ext2globrule (extname) {
    return _assertExt(extname) && `*${extname}`
}

function _getCopyWhiteListViaGlobrule (globRules = []) {
    function _handler ({
        baseDir, distDir, filename
    }) {
        const srcpath = path.resolve(baseDir, filename)

        const [_filename] = mm([filename], globRules)
        const distpath = path.resolve(distDir, _filename)
        if (_filename) {
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
    }

    return _handler
}

const DEFAULT_FILEGLOB_TO_COPY = ['*.js', '*.jsc', '*.json']
const DEFAULT_INCLUDE_GLOB_LIST = ['*', '!node_modules', '!.ts']

exports.compileDirectoryTo = function (baseDir, distDir, directoryCompilationOptions) {
    if (!fs.exists(distDir)) {
        UTILs.mkdirp(distDir)
    }
    const blobNameList = fs.readdir(baseDir)

    const {
        filterFileName = _getFilenameFilter(),
        extsToCopy = undefined,
        fileglobsToCopy = DEFAULT_FILEGLOB_TO_COPY,
        includeLeveledGlobs = DEFAULT_INCLUDE_GLOB_LIST,
        compilerOptions = null
    } = directoryCompilationOptions || {}

    /* deal with old api :start */
    let finalFileGlobsToCopy = fileglobsToCopy
    let _globRulesForOldApi
    if (Array.isArray(extsToCopy)) {
        _globRulesForOldApi = extsToCopy.map(_ext2globrule)
    } else if (extsToCopy === '*') {
        _globRulesForOldApi = ['*']
    }
    /* deal with old api :end */
    if (Array.isArray(_globRulesForOldApi)) {
        finalFileGlobsToCopy = _globRulesForOldApi
    }
    const _onFile = _getCopyWhiteListViaGlobrule(finalFileGlobsToCopy)

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
        } else if (!stat.isFile()) {
            return
        }

        _onFile({
            baseDir,
            distDir,
            filename: blobname
        })

        if (!filterFileName(blobname)) {
            return
        }

        const tbasename = blobname.replace('.ts', '.js')
        const tpath = path.join(distDir, tbasename)

        compileFile.compileFileTo(fullspath, tpath, compilerOptions)
    })
}
