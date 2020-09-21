import ts = require('typescript');
export declare function createLanguageServiceFromFiles({ rootFileNames, options }: {
    rootFileNames: string[];
    options: ts.CompilerOptions;
}): {
    services: ts.LanguageService;
    files: ts.MapLike<{
        version: number;
    }>;
};
