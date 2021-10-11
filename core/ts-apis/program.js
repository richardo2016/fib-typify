const ts = require('typescript')

const fs = require('fs')
const path = require('path')

const mkdirp = require('@fibjs/mkdirp')

const { resolveCwdTsProject } = require('./compilerOptions')

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

  host.directoryExists = (target) => {
    return fs.existsSync(target) && fs.statSync(target).isDirectory();
  }

  host.fileExists = (fileName) => {
    return fs.existsSync(fileName);
  }

  return host;
}

const createProgram = exports.createProgram = function createProgram(
  fileNames,
  compilerOptions,
  compilerHost = createCompilerHost(compilerOptions)
) {

  return ts.createProgram({
    rootNames: fileNames,
    options: compilerOptions,
    host: compilerHost
  });
}

const runProgram = exports.runProgram = (fileNames, compilerOptions, {
    cwd = process.cwd()
} = {}) => {
    const parsedTsConfig = resolveCwdTsProject(compilerOptions.project, {
        compilerHost: createCompilerHost(compilerOptions),
        files: fileNames,
        cwd
    })
    if (parsedTsConfig.errors.length)
        throw new Error(parsedTsConfig.errors[0].messageText)

    const program = createProgram(fileNames, {
        "noEmitOnError": true,
        "declaration": false,
        ...compilerOptions,
        ...parsedTsConfig && parsedTsConfig.options
    })

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

    process.exit(emitResult.emitSkipped ? 1 : 0)
}
