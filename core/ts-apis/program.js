const ts = require('typescript')

const fs = require('fs')
const path = require('path')

const mkdirp = require('@fibjs/mkdirp')

/**
 * @description fibjs has similar file system APIs with NodeJS, which is default runtime of typescript.js.
 * 
 * We don't need re-implement all compilerHost APIs starting from scratch. Just fixup some error caused by
 * differences of fs-API between fibjs and NodeJS.
 * @param options 
 */
const createCompilerHost = exports.createCompilerHost = function createCompilerHost(compilerOptions) {
  const host = ts.createCompilerHost(compilerOptions);

  host.writeFile = (fileName, contents, writeByteOrderMark, onError, sourceFiles) => {
    mkdirp(path.dirname(fileName));
    fs.writeTextFile(fileName, contents);

    return contents;
  }

  // host.readFile = (fileName) => {
  //   return fs.readTextFile(fileName)
  // }

  return host;
}

const createProgram = exports.createProgram = function createProgram(
  fileNames,
  compilerOptions,
  host = createCompilerHost(compilerOptions)
) {
    return ts.createProgram(
        fileNames,
        compilerOptions,
        host
    );
}