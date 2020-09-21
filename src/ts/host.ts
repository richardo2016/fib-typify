import ts = require('typescript');
import fs = require('fs');

export function createLanguageServiceFromFiles ({
    rootFileNames,
    options
}: {
    rootFileNames: string[]
    options: ts.CompilerOptions
}) {
    const files: ts.MapLike<{ version: number }> = {};

    // initialize the list of files
    rootFileNames.forEach(fileName => {
        files[fileName] = { version: 0 };
    });

    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: fileName =>
            files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: fileName => {
            if (!fs.exists(fileName)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFile(fileName).toString());
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
        readDirectory: ts.sys.readDirectory,
        directoryExists: ts.sys.directoryExists,
        getDirectories: ts.sys.getDirectories,
        // writeFile: ts.sys.writeFile
    };

    const services = ts.createLanguageService(servicesHost)

    return {
        services,
        files
    }
}
