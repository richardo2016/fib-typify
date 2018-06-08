const vm = require('vm')

const fs = require('fs')
const path = require('path')

const fibTypify = require('../')

const compilerOptions1 = {
    target: 'es6',
    module: 'commonjs'
}
const compilerOptions2 = {
    target: 'es5',
    module: 'commonjs'
}

describe('fs-directory', () => {
    it('compileDirectoryTo', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(__dirname, './dist/directory')

        fibTypify.compileDirectoryTo(baseDir, distDir)
    })

    it('compileDirectoryTo with compilerOptions1', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(__dirname, './dist/directory1')

        fibTypify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptions1 })
    })

    it('compileDirectoryTo with compilerOptions2', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(__dirname, './dist/directory2')

        fibTypify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptions2 })
    })
})
