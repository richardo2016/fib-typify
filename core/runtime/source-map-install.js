const fs = require('fs')

const getCacheSourceMap = function (filename) {
    return fs.readFile(`/${filename}.zip$/index.map`, 'utf-8')
}

const sourceMapSupport = require('source-map-support');
sourceMapSupport.install({
    retrieveFile (filename) {
        if (!fs.exists(filename))
            return null

        if (filename.lastIndexOf('.ts') < 0)
            return null

        // let mapFilename = filename + '.map'
        try {
            return getCacheSourceMap(filename)
            // return require(mapFilename, __dirname)
        } catch (e) {
            console.warn(`retrieveFile ${filename} failed, view error detail to help.`)
            console.error(e.stack)
        }
    }
})
