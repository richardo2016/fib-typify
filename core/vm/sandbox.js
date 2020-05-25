const ts = require('typescript')

const fs = require('fs')
const path = require('path')

const TS_INTERNAL_PROTOCOL = 'vmts:'
const getInternalVMTSFilename = exports.getInternalVMTSFilename = (jsOrFilename) => {
    jsOrFilename = jsOrFilename.replace(/\.tsx?/, '.js')
    return `${TS_INTERNAL_PROTOCOL}${path.normalize(jsOrFilename)}`
}
exports.createCompilerHostForSandboxRegister = function (compilerOptions, sandbox) {
    const host = ts.createCompilerHost(compilerOptions);
    sandbox.compiledContents = sandbox.compiledContents || {};

    host.writeFile = (filename, contents, writeByteOrderMark, onError, sourceFiles) => {
        let targetFilename = getInternalVMTSFilename(filename)
        /**
         * @description `.originalFilename` is un-type-declared field but valid in reality
         */
        const originalFilename = sourceFiles[0] && (sourceFiles[0].originalFilename || sourceFiles[0].fileName) || filename
        if (originalFilename) {
            targetFilename = getInternalVMTSFilename(originalFilename)
        }

        let key = 'js'
        if (filename.endsWith('.js')) {
            key = 'js'
        } else if (filename.endsWith('.map')) {
            key = 'map'
        }
        sandbox.addScript(
            targetFilename,
            `module.exports = ${JSON.stringify({
                [key]: contents
            })}`
        )
  
        return contents;
    }

    return host
}