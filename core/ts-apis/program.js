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
exports.createCompilerHost = function createCompilerHost(compilerOptions) {
  const host = ts.createCompilerHost(compilerOptions);

  host.writeFile = (fileName, contents, writeByteOrderMark, onError, sourceFiles) => {
    mkdirp(path.dirname(fileName));
    fs.writeTextFile(fileName, contents);

    return contents;
  }

  return host;
}

exports.createProgram = function createProgram(fileNames, compilerOptions) {
    return ts.createProgram(
        fileNames,
        compilerOptions,
        createCompilerHost(compilerOptions)
    );
}

exports.compileOnProcess = function compileOnProcess (fileNames, options) {
    const program = createProgram(fileNames, options)
    const emitResult = program.emit();

    const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });

    return emitResult;
}