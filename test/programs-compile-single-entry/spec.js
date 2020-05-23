const fs = require('fs');
const path = require('path');

const ts = require('typescript')
const rmdirr = require('@fibjs/rmdirr')
const { TsProgram } = require('../../')
const UnitTestDir = path.resolve(__dirname, '.')

describe('TsProgram.compile - single entry', () => {
    it("just compile", () => {
        const emitResult = TsProgram.compile(
            [
                path.resolve(UnitTestDir, './just-compile/ts.dir/index.ts')
            ],
            {
                noEmit: true,
                noEmitOnError: true,
                noImplicitAny: true,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
            }
        )

        assert.notOk(
            fs.exists(path.resolve(UnitTestDir, './just-compile/output.js.dir/index.js'))
        )

        assert.notOk(
            fs.exists(path.resolve(UnitTestDir, './just-compile/output.dts.dir/index.d.ts'))
        )

        assert.ok(emitResult.emitSkipped)
        assert.isUndefined(emitResult.emittedFiles)
    });

    it("with-error", () => {
        const emitResult = TsProgram.compile(
            [
                path.resolve(UnitTestDir, './with-error/ts.dir/index.ts')
            ],
            {
                noEmit: true,
                noImplicitAny: true,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
            }
        )

        assert.ok(emitResult.emitSkipped)
    });

    it("emit declaration", () => {
        rmdirr(path.resolve(UnitTestDir, './emit-declartion/output.dts.dir'))
        rmdirr(path.resolve(UnitTestDir, './emit-declartion/output.js.dir'))

        const emitResult = TsProgram.compile(
            [
                path.resolve(UnitTestDir, './emit-declartion/ts.dir/index.ts')
            ],
            {
                noEmitOnError: true,
                noImplicitAny: true,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
                declaration: true,
                declarationDir: path.resolve(UnitTestDir, './emit-declartion/output.dts.dir/'),
                outDir: path.resolve(UnitTestDir, './emit-declartion/output.js.dir/'),
            }
        )

        assert.ok(
            fs.exists(path.resolve(UnitTestDir, './emit-declartion/output.js.dir/index.js'))
        )

        assert.ok(
            fs.exists(path.resolve(UnitTestDir, './emit-declartion/output.dts.dir/index.d.ts'))
        )

        assert.isFalse(emitResult.emitSkipped)
        assert.isUndefined(emitResult.emittedFiles)
    });

    it("emit declaration only", () => {
        rmdirr(path.resolve(UnitTestDir, './emit-declartion-only/output.dts.dir'))
        rmdirr(path.resolve(UnitTestDir, './emit-declartion-only/output.js.dir'))

        const emitResult = TsProgram.compile(
            [
                path.resolve(UnitTestDir, './emit-declartion-only/ts.dir/index.ts')
            ],
            {
                noEmitOnError: true,
                noImplicitAny: true,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
                emitDeclarationOnly: true,
                declaration: true,
                declarationDir: path.resolve(UnitTestDir, './emit-declartion-only/output.dts.dir/'),
                outDir: path.resolve(UnitTestDir, './emit-declartion-only/output.js.dir/'),
            }
        )

        assert.isFalse(
            fs.exists(path.resolve(UnitTestDir, './emit-declartion-only/output.js.dir/index.js'))
        )

        assert.ok(
            fs.exists(path.resolve(UnitTestDir, './emit-declartion-only/output.dts.dir/index.d.ts'))
        )

        assert.isFalse(emitResult.emitSkipped)
    });
});