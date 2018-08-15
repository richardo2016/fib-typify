const test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')
const process = require('process')
const coroutine = require('coroutine')

const cmd = process.execPath

const argFlags = require('../bin/utils/arg_flags')
const errCode = require('../bin/utils/err_code')

describe('fib-typify', () => {
    it('empty args', () => {
        const result = process.open(cmd, [
            path.join(__dirname, '../bin', 'fib-typify.js')
        ])
        assert.equal( result.readLine(), errCode["noArg:output"] )
    })

    it(`check ${argFlags.output.join(',')}`, () => {
        const inputsrc = './test/ts'
        const outputdist = './test/dist/process_output'
        const result = process.run(cmd, [
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
})

require.main === module && test.run(console.DEBUG)
