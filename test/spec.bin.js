const test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')
const process = require('process')

const cmd = process.execPath

const argFlags = require('../bin/utils/arg_flags')
const errCode = require('../bin/utils/err_code')

describe('fib-typify', () => {
    it('empty args', () => {
        const sproc = process.open(cmd, [
            path.join(__dirname, '../bin', 'fib-typify')
        ])
        assert.equal( sproc.readLine(), errCode["noArg:output"] )
    })

    it(`check ${argFlags.output.join(',')}`, () => {
        const inputsrc = './test/ts'
        const outputdist = './test/dist/process_output'
        process.run(cmd, [
            path.join(__dirname, '../bin', 'fib-typify'),
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
                path.join(__dirname, '../bin', 'fib-typify'),
                './entry-point/test',
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(sproc.readLine(), 'I am from entry-point/test.ts')
        })

        it('relative path: directory entry', () => {
            let sproc = process.open(cmd, [
                path.join(__dirname, '../bin', 'fib-typify'),
                './entry-point',
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(sproc.readLine(), 'I am from entry-point/test.ts')
            assert.equal(sproc.readLine(), 'I am from entry-point/index.ts')
        })
    })
})

require.main === module && test.run(console.DEBUG)
