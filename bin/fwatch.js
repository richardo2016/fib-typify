#!/usr/bin/env fibjs
'use strict';

const path = require('path')

const fs = require('fs')

const ts = require('typescript')
const mm = require('micromatch')

const pkgJson = require('../package.json')
const cli = require('@fxjs/cli')('fwatch')

const { formatAndPrintDiagnostic } = require('../core/ts-apis/diagnostic');
const { getCwdFilenamesR, fixNonAbsolutePath } = require('../core/_utils');


const topCmd = cli
    .command('[...directories]', 'watch directory', {
        allowUnknownOptions: true
    })

topCmd
    .action(function (directories, _) {
        const { watch } = require('../lib/internal');

        let workDir = directories && directories[0] || './';
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
