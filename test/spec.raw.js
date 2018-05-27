const vm = require('vm')
const fs = require('fs')
const path = require('path')

const fibTypify = require('../')

const rawTest = {
    input: `
export function add (a: number, b: number) {
    return a + b
}

export function http () {
    return 'http'
}

export function hello () {
    return 'hello, world'
}
`,
    sboxName: 'raw'
}

describe('raw', () => {
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

    it('compile', () => {
        const compiledString = fibTypify.compileRaw(rawTest.input)
        assert.isString(compiledString)

        const sbox = new vm.SandBox({})
        sbox.addScript(rawTest.sboxName, new Buffer(compiledString))

        const rawModule = sbox.require(rawTest.sboxName, __dirname)
        assertSandboxForBasicTs(rawModule)
    })

    it('compileToFile', () => {
        const target = path.resolve(__dirname, './dist/raw/compileToFile.js')
        fibTypify.compileRawToFile(rawTest.input, target)
        assert.equal(fs.exists(target), true)
    })

    it('compileToSandBox', () => {
        const sbox = fibTypify.compileRawToSandbox(rawTest.input, {
            sboxName: 'rawbasic'
        })

        const module = sbox.require('rawbasic', __dirname)
        assertSandboxForBasicTs(module)
    })
})
