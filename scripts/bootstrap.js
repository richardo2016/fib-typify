/**
 * This file is just one heuristic sample, to show how to compile entry file of this library
 */
const ts = require('typescript')
const path = require('path')

// cwd() is the real package root
const PKG_ROOT = process.cwd()

const { createProgram } = require('../core/ts-apis/program')

const program = createProgram([
    path.resolve(PKG_ROOT, './src/index.ts')
], {
    "outDir": "./lib",
    "noEmitOnError": true,
    "declaration": true,
    "declarationDir": "./typings"
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