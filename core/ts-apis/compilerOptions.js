const fs = require('fs')
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
const getParseConfigHost = exports.getParseConfigHost = (compilerHost, cwd) => {
    // this API is from typescript, not documented
    return ts.createCachedDirectoryStructureHost(compilerHost, cwd, process.platform !== 'win32')
}

exports.resolveCwdTsProject = function (projectName = 'tsconfig.json', {
    compilerHost,
    cwd = process.cwd(),
}) {
    projectName = path.isAbsolute(projectName) ? projectName : path.resolve(cwd, projectName)

    let tsconfigContent = JSON.stringify({})
    try {
        tsconfigContent = fs.readTextFile(projectName)
    } catch (error) {}

    const configParsedResult = ts.parseConfigFileTextToJson(projectName, tsconfigContent)
    
    if (configParsedResult.error)
        throw new Error(configParsedResult.error)

    const inputTSConfig = configParsedResult.config
    // inputTSConfig.files = fileNames

    // TODO: learn about ts.ParsedTsConfig, why its real value is augument of its declartion(in types)
    const parsedTSConfig = ts.parseJsonConfigFileContent(
        inputTSConfig,
        /* parseConfigHost */getParseConfigHost(compilerHost, cwd),
        /* basePath */cwd,
        compilerOptions
    )

    return parsedTSConfig
}