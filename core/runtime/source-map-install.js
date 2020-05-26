const fs = require('fs')	

const getCacheSourceMap = function (filename) {	
    return fs.readFile(`${filename}.zip$/index.map`, 'utf-8')	
}	

global.Error = Error	
global.useGlobalError = function () {	
    return global.Error	
}	

const sourceMapSupport = require('source-map-support');	
sourceMapSupport.install({	
    retrieveFile (filename) {	
        if (!fs.exists(filename))	
            return null	

        if (filename.lastIndexOf('.ts') < 0)	
            return null	

        try {	
            return getCacheSourceMap(filename)	
        } catch (e) {	
            console.warn(`[retrieveFile] retrieve sourcemap for ${filename} failed, view error detail to help.`)	
            console.error(e.stack)	
        }	
    }	
})