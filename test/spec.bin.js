const test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')

const cmd = process.execPath
const fibTypify = path.join(__dirname, '../bin', 'fib-typify.js')

const argFlags = require('../bin/utils/arg_flags')
const errCode = require('../bin/utils/err_code')

const { isSupportSetModuleCompiler } = require('../core/compat')
const { openProcess, runProcess } = require('./utils')

describe('fib-typify', () => {
    it('empty args', () => {
        assert.equal(openProcess(cmd, [
            fibTypify
        ]).stderr.readLine(), errCode["noArg:output"])
    })

    it(`check ${argFlags.output.join(', ')}`, () => {
        const inputsrc = './test/ts'
        const outputdist = './test/dist/process_output'
        runProcess(cmd, [
            fibTypify,
            inputsrc,
            '-o',
            outputdist
        ], {
            env: {
                FIB_TYPIFY_DEBUG: "1"
            }
        })

        assert.equal( fs.exists(
            path.resolve(__dirname, '../', outputdist)
        ), true )
    })

    it(`compile single file`, () => {
        const inputsrc = './test/ts/basic.ts'
        const outputdist = path.resolve(__dirname, '../', './test/ts/basic.js')

        runProcess(cmd, [
            fibTypify,
            inputsrc,
            '--out'
        ], {
            env: {
                FIB_TYPIFY_DEBUG: "1"
            }
        })

        assert.equal( fs.exists(outputdist), true )
        fs.unlink(outputdist)
    })

    it(`compile single file with shebang`, () => {
        const inputsrc = './test/ts_files/basic.ts'
        const outputdist = path.resolve(__dirname, '../', './test/ts_files/basic.js')

        runProcess(cmd, [
            fibTypify,
            inputsrc,
            '--out'
        ], {
            env: {
                FIB_TYPIFY_DEBUG: "1"
            }
        })

        assert.equal( fs.exists(outputdist), true )
        assert.isTrue( fs.readTextFile(outputdist).indexOf('#!') === 0 )
        fs.unlink(outputdist)
    })

    describe(`run typescript directly`, () => {
        let current = null;
        before(() => {
            current = process.cwd();
            process.chdir(path.resolve(__dirname));
        })

        after(() => {
            process.chdir(current);
        })

        it('relative path: non-index.ts', () => {
            let { stdout } = openProcess(cmd, [
                fibTypify,
                isSupportSetModuleCompiler() ? './entry-point/test' : './entry-point/test.ts',
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(stdout.readLine(), 'I am from entry-point/test.ts')
        })

        it('relative path: directory entry', () => {
            let { stdout } = openProcess(cmd, [
                fibTypify,
                isSupportSetModuleCompiler() ? './entry-point' : './entry-point/index-old.ts',
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(stdout.readLine(), 'I am from entry-point/test.ts')
            assert.equal(stdout.readLine(), 'I am from entry-point/index.ts')
        })
    })

    require('./bin-typify/spec')
})

require.main === module && test.run(console.DEBUG)
