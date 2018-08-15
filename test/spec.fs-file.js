const test = require('test');
test.setup();

const vm = require('vm')

const fs = require('fs')
const path = require('path')

const fibTypify = require('../')

const fsFileTestBasic = {
    inputFilepath: path.resolve(__dirname, './ts/basic.ts'),
    outputFilepath: path.join(__dirname, './dist/fs-file/basic.js'),
    sboxName: 'file'
}
const fsFileTestInterface = {
    inputFilepath: path.resolve(__dirname, './ts/interface.ts')
}
const fsFileTestImport = {
    inputFilepath: path.resolve(__dirname, './ts/import.ts')
}

describe('fs-file', () => {
    function assertSandboxForBasicTs (rawModule) {
        assert.isObject(rawModule)
        assert.isFunction(rawModule.add)
        assert.isFunction(rawModule.http)
        assert.equal(rawModule.http(), 'http')
        assert.isFunction(rawModule.add)
        assert.equal(rawModule.add(1, 2), 3)

        assert.isFunction(rawModule.hello)
        assert.isFunction(rawModule.hello)
        assert.equal(rawModule.hello(), 'hello, world')
    }

    it('compileFile', () => {
        const compiledJScript = fibTypify.compileFile(fsFileTestBasic.inputFilepath)
        assert.isString(compiledJScript)

        const sbox = new vm.SandBox({})
        sbox.addScript(fsFileTestBasic.sboxName, new Buffer(compiledJScript))

        const rawModule = sbox.require(fsFileTestBasic.sboxName, __dirname)
        assertSandboxForBasicTs(rawModule)
    })

    it('compileFileTo', () => {
        fibTypify.compileFileTo(fsFileTestBasic.inputFilepath, fsFileTestBasic.outputFilepath)
        assert.equal(fs.exists(fsFileTestBasic.outputFilepath), true)
    })

    it('compileFileToSandbox basic', () => {
        const rawModule = fibTypify.compileFileToSandBox(fsFileTestBasic.inputFilepath, {
            sboxName: 'fs-file-basic'
        }).require('fs-file-basic', __dirname)
        assertSandboxForBasicTs(rawModule)
    })

    it('compileFileToSandbox interface', () => {
        const rawModule = fibTypify.compileFileToSandBox(fsFileTestInterface.inputFilepath, {
            sboxName: 'fs-file-interface'
        }).require('fs-file-interface', __dirname)

        assert.isObject(rawModule)
        assert.isFunction(rawModule.doFoo)
        assert.equal(rawModule.doFoo({
            foo1: '1',
            bar: 2,
            bar1: 3
        }), '123')
        assert.equal(isNaN(
            rawModule.doFoo({})
        ), true)
    })

    xit('compileFileToSandbox import', () => {
        const sbox = fibTypify.compileFileToSandBox(fsFileTestImport.inputFilepath, {
            sboxName: 'fs-file-import',
            sboxFallback: (mname) => {
                console.log('mname', mname)
            }
        })
        const rawModule = sbox.require('fs-file-import', __dirname)

        assert.isObject(rawModule)
        assert.isFunction(rawModule)
        assert.equal(rawModule(), 'hello')
    })
})

require.main === module && test.run(console.DEBUG)
