#!/usr/bin/env fibjs

const path = require('path')
const util = require('util')

const fs = require('fs')

const ts = require('typescript')
const readdirr = require('@fibjs/fs-readdir-recursive')
const mm = require('micromatch')

const pkgJson = require('../package.json')
const cli = require('@fxjs/cli')(pkgJson.name)

const CWD = process.cwd()

const { createProgram, createCompilerHost } = require('../core/ts-apis/program')
const { getParseConfigHost } = require('../core/ts-apis/compilerOptions')

const runProgram = (fileNames, cmdLineOptions) => {
    const compilerOptions = util.pick(cmdLineOptions, [
        'noEmit',
        'project',
        'outDir'
    ])
    const host = createCompilerHost(compilerOptions)

    if (!cmdLineOptions.project) cmdLineOptions.project = 'tsconfig.json'
    cmdLineOptions.project = fixNonAbsolutePath(cmdLineOptions.project, CWD)

    const configParsedResult = ts.parseConfigFileTextToJson(cmdLineOptions.project, fs.readTextFile(cmdLineOptions.project))
    
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

cli
    .command('[...files]', 'source file')
    // @TODO: use tyepscript's built-in 18n resources.
    .option('--noEmit <noEmit>', 'Do not emit outputs.', {
        default: false
    })
    .option('-p, --project <project>', 'tsconfig.json path', {
        default: path.resolve(CWD, './tsconfig.json')
    })
    .option('--outDir [target]', 'output target', {
        default: path.resolve(CWD)
    })
    .action(function (files, cmdLineOptions) {
        if (!files.length) {
            console.log('[ftsc] getCwdFilenamesR()', getCwdFilenamesR());
            // by default, when no files input specified, ftsc use all ts(x) files at current directory as input.
            files = mm(getCwdFilenamesR(), ['*.ts', '*.tsx'])
        }

        runProgram(files, cmdLineOptions)
    })

cli.help()
cli.version(pkgJson.version)

cli.parse()