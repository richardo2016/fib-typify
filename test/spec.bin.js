const test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')

const cmd = process.execPath

const argFlags = require('../bin/utils/arg_flags')
const errCode = require('../bin/utils/err_code')

const { isSupportSetModuleCompiler } = require('../core/compat')

const readSubProcessLine = (sp) => {
    if (typeof sp.readLine === 'function')
        return sp.readLine()

    return sp.stdout.readLine()
}

describe('fib-typify', () => {
    it('empty args', () => {
        const sproc = process.open(cmd, [
            path.join(__dirname, '../bin', 'fib-typify.js')
        ])

        assert.equal( readSubProcessLine(sproc), errCode["noArg:output"] )
    })

    it(`check ${argFlags.output.join(', ')}`, () => {
        const inputsrc = './test/ts'
        const outputdist = './test/dist/process_output'
        process.run(cmd, [
            path.join(__dirname, '../bin', 'fib-typify.js'),
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

        process.run(cmd, [
            path.join(__dirname, '../bin', 'fib-typify.js'),
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

        process.run(cmd, [
            path.join(__dirname, '../bin', 'fib-typify.js'),
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
            let sproc = process.open(cmd, [
                path.join(__dirname, '../bin', 'fib-typify.js'),
                isSupportSetModuleCompiler() ? './entry-point/test' : './entry-point/test.ts',
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(readSubProcessLine(sproc), 'I am from entry-point/test.ts')
        })

        it('relative path: directory entry', () => {
            let sproc = process.open(cmd, [
                path.join(__dirname, '../bin', 'fib-typify.js'),
                isSupportSetModuleCompiler() ? './entry-point' : './entry-point/index-old.ts',
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(readSubProcessLine(sproc), 'I am from entry-point/test.ts')
            assert.equal(readSubProcessLine(sproc), 'I am from entry-point/index.ts')
        })
    })
})

require.main === module && test.run(console.DEBUG)
