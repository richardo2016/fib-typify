const fs = require('fs')
const __sourceMapBox = require('__sourceMapBox')

const sourceMapSupport = require('source-map-support');
sourceMapSupport.install({
    retrieveFile (filename) {
        if (!fs.exists(filename))
            return null

        if (filename.lastIndexOf('.ts') < 0)
            return null

        try {
            return __sourceMapBox.require(filename, __dirname)
        } catch (e) {
            console.warn(`retrieveFile ${filename} failed, view error detail to help.`)
            console.error(e.stack)
        }
    }
})
