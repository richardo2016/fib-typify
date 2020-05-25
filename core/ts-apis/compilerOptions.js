const fs = require('fs')
const path = require('path')

const ts = require('typescript')

// CompilerOptions
const compilerOptions = {
    module: ts.ModuleKind.CommonJS
}

exports.getDefaultCompilerOptions = () => compilerOptions

/**
 * @description return one ts.ParseConfigHost
 */
const getParseConfigHost = exports.getParseConfigHost = (compilerHost, cwd) => {
    // this API is from typescript, not documented
    return ts.createCachedDirectoryStructureHost(compilerHost, cwd, process.platform !== 'win32')
}

exports.resolveCwdTsProject = function (projectName = 'tsconfig.json', {
    /**
     * @why for ts 3.9, files/inputs are required.
     */
    files = [],
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
        throw new Error(configParsedResult.error.messageText)

    const inputTSConfig = configParsedResult.config
    inputTSConfig.files = files

    // TODO: learn about ts.ParsedTsConfig, why its real value is augument of its declartion(in types)
    const parsedTSConfig = ts.parseJsonConfigFileContent(
        inputTSConfig,
        /* parseConfigHost */getParseConfigHost(compilerHost, cwd),
        /* basePath */cwd,
        compilerOptions
    )

    return parsedTSConfig
}