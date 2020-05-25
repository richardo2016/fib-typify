const ts = require('typescript')

const fs = require('fs')
const path = require('path')

const TS_INTERNAL_PROTOCOL = exports.TS_INTERNAL_PROTOCOL = 'vmts:'
const getInternalVMTSFilename = exports.getInternalVMTSFilename = (jsOrFilename) => {
    jsOrFilename = jsOrFilename.replace(/\.tsx?/, '.js')
    return `${TS_INTERNAL_PROTOCOL}${path.normalize(jsOrFilename)}`
}
exports.createCompilerHostForSandboxRegister = function (compilerOptions, sandbox) {
    const host = ts.createCompilerHost(compilerOptions);
    sandbox.compiledContents = sandbox.compiledContents || {};

    host.writeFile = (filename, contents, writeByteOrderMark, onError, sourceFiles) => {
        let key = 'js'
        if (filename.endsWith('.js')) {
            key = 'js'
        } else if (filename.endsWith('.map')) {
            key = 'map'
        }
        sandbox.addScript(
            getInternalVMTSFilename(filename),
            `module.exports = ${JSON.stringify({
                [key]: contents
            })}`
        )
  
        return contents;
    }

    return host
}