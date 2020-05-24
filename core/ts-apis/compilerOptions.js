const path = require('path')

const ts = require('typescript')

// CompilerOptions
const compilerOptions = {
    module: ts.ModuleKind.CommonJS
}

exports.getDefaultCompilerOptions = () => compilerOptions

exports.filterCompilerOptions = function (compilerOptions) {
    if (compilerOptions.sourceMap) {
        console.warn(`[fib-typify] don't support sourceMap now, tranform to 'inlineSourceMap' automatically.`)
        compilerOptions.sourceMap = false
        compilerOptions.inlineSourceMap = true
    }
}

/**
 * @description return one ts.ParseConfigHost
 */
exports.getParseConfigHost = (compilerHost, cwd) => {
    // this API is from typescript, not documented
    return ts.createCachedDirectoryStructureHost(compilerHost, cwd, process.platform !== 'win32')
}

exports.resolveCwdTsProject = function (projectName = 'tsconfig.json') {
    projectName = path.isAbsolute(projectName) ? projectName : path.resolve(process.cwd(), projectName)

    const configParsedResult = ts.parseConfigFileTextToJson(projectName, fs.readTextFile(projectName))
    
    if (configParsedResult.error)
        throw new Error(configParsedResult.error)

    inputTSConfig = configParsedResult.config
    inputTSConfig.files = fileNames

    // TODO: learn about ts.ParsedTsConfig, why its real value is augument of its declartion(in types)
    const parsedTSConfig = ts.parseJsonConfigFileContent(
        inputTSConfig,
        /* parseConfigHost */getParseConfigHost(host, CWD),
        /* basePath */CWD,
        compilerOptions
    )

    return parsedTSConfig
}