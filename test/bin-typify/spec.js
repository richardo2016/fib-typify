const fs = require('fs');
const path = require('path');

const ts = require('typescript')
const rmdirr = require('@fibjs/rmdirr')

const UnitTestDir = path.resolve(__dirname, '.')
const PKG_ROOT = path.resolve(__dirname, '../../')

const { chDirAndDo, openProcess } = require('../utils')

const cmd = process.execPath
const fibTypify = path.resolve(PKG_ROOT, './bin/fib-typify.js')

describe('./node_modules/.bin/fib-typify', () => {
    it("tsconfig1", () => {
        chDirAndDo(path.resolve(UnitTestDir, './tsconfig1'), () => {
            let { stdout } = openProcess(cmd, [
                fibTypify,
                './index.ts'
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(stdout.readLine(), 'bar')
        })
    });

    it("tsconfig2", () => {
        chDirAndDo(path.resolve(UnitTestDir, './tsconfig2'), () => {
            let { stdout } = openProcess(cmd, [
                fibTypify,
                './dev.ts'
            ], {
                env: {
                    FIB_TYPIFY_DEBUG: ""
                }
            })

            assert.equal(stdout.readLine(), 'tsconfig2')
        })
    });
});
