const fs = require('fs');
const path = require('path');

const ts = require('typescript')
const rmdirr = require('@fibjs/rmdirr')

const UnitTestDir = path.resolve(__dirname, '.')
const PKG_ROOT = path.resolve(__dirname, '../../')

const { chDirAndDo } = require('../utils')

const cmd = process.execPath
const ftsc = path.resolve(PKG_ROOT, './bin/ftsc.js')

describe.only('./node_modules/.bin/ftsc', () => {
    it("emit declaration", () => {
        rmdirr(path.resolve(UnitTestDir, './emit-declartion/output.dts.dir'))
        rmdirr(path.resolve(UnitTestDir, './emit-declartion/output.js.dir'))

        chDirAndDo(path.resolve(UnitTestDir, './emit-declartion'), () => {
            const pcode = process.run(cmd,  [
                ftsc,
                './ts.dir/*',
                '--outDir',
                './output.js.dir',
                '--declaration',
                '--declarationDir',
                './output.dts.dir',
            ])

            assert.equal(pcode, 0)

            assert.ok(
                fs.exists(path.resolve(UnitTestDir, './emit-declartion/output.js.dir/index.js'))
            )

            assert.ok(
                fs.exists(path.resolve(UnitTestDir, './emit-declartion/output.dts.dir/index.d.ts'))
            )
        })
    });

    it("emit declaration only", () => {
        rmdirr(path.resolve(UnitTestDir, './emit-declartion-only/output.dts.dir'))
        rmdirr(path.resolve(UnitTestDir, './emit-declartion-only/output.js.dir'))

        chDirAndDo(path.resolve(UnitTestDir, './emit-declartion-only'), () => {
            const pcode = process.run(cmd,  [
                ftsc,
                './ts.dir/*',
                '--emitDeclarationOnly',
                '--declaration',
                '--declarationDir',
                './output.dts.dir',
            ])
    
            assert.equal(pcode, 0)
    
            assert.isFalse(
                fs.exists(path.resolve(UnitTestDir, './emit-declartion-only/output.js.dir/index.js'))
            )
    
            assert.ok(
                fs.exists(path.resolve(UnitTestDir, './emit-declartion-only/output.dts.dir/index.d.ts'))
            )
        })
    });
});