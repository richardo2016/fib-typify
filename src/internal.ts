/**
 * @warning internal.ts is some apis used internally only in fib-typify, we expose them
 * for `bin/*.js`, never dependes it in you App.
 */

import fs = require('fs');
import path = require('path');

import * as ts from 'typescript';
import { createLanguageServiceFromFiles } from './ts/host';

const mkdirp = require('@fibjs/mkdirp')

const { fixNonAbsolutePath } = require('../core/_utils');
const { formatAndPrintDiagnostic } = require('../core/ts-apis/diagnostic');

function isWatchValid() {
    return typeof fs.watchFile === 'function'
}

export function watch(
    rootFileNames: string[],
    options: ts.CompilerOptions,
    workDir: string = process.cwd()
) {
    if (!isWatchValid()) {
        throw new Error(`unsupported watch in this fibjs's version! fibjs >= 0.31.0 required!`)
    }

    const { services, files } = createLanguageServiceFromFiles({
        rootFileNames,
        options
    })

    // Now let's watch the files
    rootFileNames.forEach(fileName => {
        // First time around, emit all files
        emitFile(fileName);

        // Add a watch on the file to handle next change
        fs.watchFile(fileName, { persistent: true, interval: 250 }, (
            curr: Class_Stat,
            prev: Class_Stat
        ) => {
            // Check timestamp
            if (+curr.mtime <= +prev.mtime) {
                return;
            }

            // Update the version to signal a change in the file
            files[fileName].version++;

            // write the changes to disk
            emitFile(fileName);
        });
    });

    function emitFile(fileName: string) {
        let output = services.getEmitOutput(fileName);

        if (!output.emitSkipped) {
            // console.log(`Emitting ${fileName}`);
        } else {
            // console.log(`Emitting ${fileName} failed`);
            logErrors(fileName);
        }

        output.outputFiles.forEach(o => {
            const fullp = fixNonAbsolutePath(o.name, workDir)
            mkdirp(path.dirname(fullp));
            fs.writeTextFile(fullp, o.text);
        });
    }

    function logErrors(fileName: string) {
        const allDiagnostics = services
            .getCompilerOptionsDiagnostics()
            .concat(services.getSyntacticDiagnostics(fileName))
            .concat(services.getSemanticDiagnostics(fileName));

        allDiagnostics.forEach(diagnostic => {
            formatAndPrintDiagnostic(diagnostic);
        });
    }
}
