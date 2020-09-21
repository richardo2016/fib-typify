#!/usr/bin/env fibjs
'use strict';

const path = require('path')

const fs = require('fs')

const ts = require('typescript')
const mm = require('micromatch')

const pkgJson = require('../package.json')
const cli = require('@fxjs/cli')('ftsc')

const CWD = process.cwd()

const { runProgram } = require('../core/ts-apis/program');
const { formatAndPrintDiagnostic } = require('../core/ts-apis/diagnostic');
const { getCwdFilenamesR, fixNonAbsolutePath } = require('../core/_utils');

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

        runProgram(files, parsedCommandLine.options, {
            cmdLineOptions,
            cwd: CWD
        })
    })

const watchCmd = cli
    .command('watch [...rootFiles]', 'run ftsc in watch mode', {
        allowUnknownOptions: true
    })

watchCmd
    .action(function (rootFiles, _) {
        const { watch } = require('../lib/internal');

        let workDir = rootFiles && rootFiles[0] || './';
        workDir = fixNonAbsolutePath(workDir, process.cwd());

        if (
            !fs.exists(workDir)
            || !fs.stat(workDir).isDirectory()
        ) {
            throw new Error(`you should provide one valid directory, but '${workDir}' is not one directory!`)
        }

        const files = mm(
            getCwdFilenamesR({ cwd: workDir }),
            ['**/*.ts', '**/*.tsx']
        )
            .map(x => path.join(workDir, x))

        if (!files.length) {
            throw new Error(`no any .ts(x) found in '${workDir}' and its sub directories`)
        }

        const tscfgpath = path.join(workDir, 'tsconfig.json');
        const tsConfigWrapper = ts.readConfigFile(tscfgpath, ts.sys.readFile);

        if (tsConfigWrapper.error) {
            formatAndPrintDiagnostic(tsConfig.error);
            process.exit(-1);
        }

        console.log(`try to watch... \n`)
        watch(
            files,
            {
                module: ts.ModuleKind.CommonJS,
                rootDir: workDir,
                ...tsConfigWrapper.config.compilerOptions,
            },
            workDir
        );

        console.log(`started watching directory: ${workDir}! \n`)
    })

cli.help()
cli.version(pkgJson.version)

cli.parse()
