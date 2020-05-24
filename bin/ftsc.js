#!/usr/bin/env fibjs

const path = require('path')
const util = require('util')

const fs = require('fs')

const ts = require('typescript')
const readdirr = require('@fibjs/fs-readdir-recursive')
const mm = require('micromatch')

const pkgJson = require('../package.json')
const cli = require('@fxjs/cli')('ftsc')

const CWD = process.cwd()

const { createProgram, createCompilerHost } = require('../core/ts-apis/program')
const { getParseConfigHost } = require('../core/ts-apis/compilerOptions')

const runProgram = (fileNames, compilerOptions, cmdLineOptions) => {
    const host = createCompilerHost(compilerOptions)

    let parsedTSConfig
    // make compilerOptions.project absolute path.
    compilerOptions.project = fixNonAbsolutePath(compilerOptions.project || 'tsconfig.json', CWD)

    let tsconfigContent = JSON.stringify({})
    try {
        tsconfigContent = fs.readTextFile(compilerOptions.project)
    } catch (error) {}

    const configParsedResult = ts.parseConfigFileTextToJson(compilerOptions.project, tsconfigContent)
    
    if (configParsedResult.error)
        throw new Error(configParsedResult.error)

    inputTSConfig = configParsedResult.config
    inputTSConfig.files = fileNames

    // TODO: learn about ts.ParsedTsConfig, why its real value is augument of its declartion(in types)
    parsedTSConfig = ts.parseJsonConfigFileContent(
        inputTSConfig,
        /* parseConfigHost */getParseConfigHost(host, CWD),
        /* basePath */CWD,
        compilerOptions
    )

    const program = createProgram(fileNames, {
        "noEmitOnError": true,
        "declaration": false,
        ...compilerOptions,
        ...parsedTSConfig && parsedTSConfig.options
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

function getCwdFilenamesR({
    allowNodeModules = false
} = {}) {
    return readdirr(CWD, x => {
        if (!allowNodeModules && x.startsWith('node_modules')) return false

        if (x[0] !== '.') return true
    })
}

function fixNonAbsolutePath(input, basedir) {
    return path.isAbsolute(input) ? input : path.resolve(basedir, input)
}

const topCmd = cli
    .command('[...files]', 'source files', {
        allowUnknownOptions: true
    })

/**
 * cmd options to be supported in the future.
 * 
 * - [ ] ts.optionsForWatch
 * - [x] ts.optionDeclarations
 * - [ ] ts.transpileOptionValueCompilerOptions
 * - [ ] ts.buildOpts
 */
ts.optionDeclarations.forEach(cmdOptionWithBuild => {
    if (cmdOptionWithBuild.name === 'help') return ;
    if (cmdOptionWithBuild.showInSimplifiedHelpView === false) return ;
    if (cmdOptionWithBuild.category && [
        ts.Diagnostics.Basic_Options,
        ts.Diagnostics.Command_line_Options,
        ts.Diagnostics.Advanced_Options,
    ].indexOf(cmdOptionWithBuild.category) === -1) return ;

    topCmd.option([
        cmdOptionWithBuild.shortName ? `--${cmdOptionWithBuild.shortName} ` : '',
        `--${cmdOptionWithBuild.name} `,
        // `[XTS_${cmdOptionWithBuild.name}]`
    ].filter(x => x).join(''), [
        /**
         * @what if cmdOptionWithBuild.type !== 'string' but cmdOptionWithBuild.type is not empty, maybe it's ReturnType<ts.createMapFromTemplate()>
         */
        cmdOptionWithBuild.type && typeof cmdOptionWithBuild.type === 'string' ? `( type: ${cmdOptionWithBuild.type.padEnd(7, ' ')} ) ` : '',
        cmdOptionWithBuild.description ? `TS: ${cmdOptionWithBuild.description.message}` : ''
    ].filter(x => x).join(''))
})

topCmd
    // .option('--fib:cwd <fib_cwd>', 'just sample option', {
    //     default: path.resolve(CWD)
    // })
    .action(function (files, cmdLineOptions) {
        if (files.length) {
            // when files is not empty, use it as glob
            files = mm(getCwdFilenamesR(), files)
        } else {
            // if files empty, try to find all files with expected extentensions in CURRENT DIRECTORY
            files = mm(getCwdFilenamesR(), ['*.ts', '*.tsx'])
        }
        
        const parsedCommandLine = ts.parseCommandLine(process.argv.slice(2), fname => fs.readTextFile(fname))
        if (parsedCommandLine.errors.length)
            throw new Error(parsedCommandLine.errors[0].messageText)

        runProgram(files, parsedCommandLine.options, cmdLineOptions)
    })


cli.help()
cli.version(pkgJson.version)

cli.parse()