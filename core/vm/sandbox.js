const ts = require('typescript')

const fs = require('fs')
const path = require('path')

exports.createCompilerHostForSandboxRegister = function (compilerOptions) {
    const host = ts.createCompilerHost(compilerOptions);
    const compiledContents = {};

    host.writeFile = (fileName, contents, writeByteOrderMark, onError, sourceFiles) => {
        compiledContents[path.normalize(fileName)] = contents;
  
        return contents;
    }

    return {
        host,
        getByFilename: (fileName) => {
            fileName = path.normalize(fileName)

            return compiledContents[fileName.replace(/\.tsx?/, '.js')]
        }
    }
}