const ts = require('typescript')

const formatAndPrintDiagnostic = exports.formatAndPrintDiagnostic = function () {
    if (diagnostic.file) {
        const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        console.error(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    } else {
        console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
    }
}
