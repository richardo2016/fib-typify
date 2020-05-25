const fs = require('fs');
const path = require('path');

const ts = require('typescript')
const rmdirr = require('@fibjs/rmdirr')

const UnitTestDir = path.resolve(__dirname, '.')
const PKG_ROOT = path.resolve(__dirname, '../../')

const { chDirAndDo, readSubProcessLine } = require('../utils')

const cmd = process.execPath
const fibTypify = path.resolve(PKG_ROOT, './bin/fib-typify.js')

describe('./node_modules/.bin/fib-typify', () => {
    it("tsconfig1", () => {
        chDirAndDo(path.resolve(UnitTestDir, './tsconfig1'), () => {
            let sproc = process.open(cmd, [
                fibTypify,
                './index.ts'
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(readSubProcessLine(sproc), 'bar')
        })
    });

    it("tsconfig2", () => {
        chDirAndDo(path.resolve(UnitTestDir, './tsconfig2'), () => {
            let sproc = process.open(cmd, [
                fibTypify,
                './dev.ts'
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(readSubProcessLine(sproc), 'tsconfig2')
        })
    });
});