const fs = require('fs');
const path = require('path');

const ts = require('typescript')
const rmdirr = require('@fibjs/rmdirr')
const { simpleCompile } = require('../../core/ts-apis/test-program')
const UnitTestDir = path.resolve(__dirname, '.')

describe('ts simple compile single entry', () => {
    it("just compile", () => {
        const emitResult = simpleCompile(
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
        assert.throws(() => {
            const emitResult = simpleCompile(
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
        })
    });

    it("emit declaration", () => {
        rmdirr(path.resolve(UnitTestDir, './emit-declartion/output.dts.dir'))
        rmdirr(path.resolve(UnitTestDir, './emit-declartion/output.js.dir'))

        const emitResult = simpleCompile(
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

        const emitResult = simpleCompile(
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