const mkdirp = require('@fibjs/mkdirp')

const CORE = require('./core')

exports._buildCacheDirectory = function (cacheDir = CORE.tsCacheDir) {
    if (!fs.exists(cacheDir)) {
        try {
            mkdirp(cacheDir)
        } catch (e) {
            console.warn(`${CORE.logPrefix}:[_buildCacheDirectory] error occured when trying to mkdirp ${cacheDir}`)
            return
        }
    }
}

exports._requireCache = function (scriptFilepath) {
}
