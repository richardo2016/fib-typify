const ts = require('typescript');
const { createProgram } = require('./program')

/**
 *
 * @param {string[]} filenames
 * @param {import('typescript').CompilerOptions} compilerOptions
 * @returns
 */
exports.simpleCompile = function (filenames, compilerOptions) {
    const program = createProgram(filenames, compilerOptions)

    const emitResult = program.emit();

    const allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            throw new Error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
        }
    });

    return emitResult
}
