const test = require('test');
test.setup();

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

const distDirPath = path.resolve(__dirname, 'dist')

try {
    fs.unlink(distDir)
} catch (e) {}

describe('fs-directory', () => {
    it('compileDirectoryTo', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(distDirPath, './directory')

        fibTypify.compileDirectoryTo(baseDir, distDir)
    })

    it('compileDirectoryTo with compilerOptions1', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(distDirPath, './directory1')

        fibTypify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptions1 })
    })

    it('compileDirectoryTo with compilerOptions2', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(distDirPath, './directory2')

        fibTypify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptions2 })
    })

    const baseDir = path.resolve(__dirname, './dir_to_copy')

    it('compileDirectoryTo with other files: default_copy', () => {
        const defaultCopyDir = path.resolve(distDirPath, './default_copy')

        fibTypify.compileDirectoryTo(baseDir, defaultCopyDir)
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '1.txt')), false )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '2.json')), true )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '3.makefile')), false )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '4.cpp')), false )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, 'glob_to_include')), true )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, 'glob_to_exclude123')), false )
    })

    it('compileDirectoryTo with other files: allcopystrategy_copy', () => {
        const allCopyStrategyDir = path.resolve(distDirPath, './allcopystrategy_copy')
        fibTypify.compileDirectoryTo(baseDir, allCopyStrategyDir, {
            extsToCopy: '*'
        })

        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, '1.txt')), true )
        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, '2.json')), true )
        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, '3.makefile')), true )
        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, '4.cpp')), true )
        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, 'node_modules')), false )
        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, 'glob_to_include')), true )
        assert.equal( fs.exists(path.resolve(allCopyStrategyDir, 'glob_to_exclude123')), true )
    })

    it('compileDirectoryTo with other files: customized_copy', () => {
        const customizedCopyDir = path.resolve(distDirPath, './customized_copy')
        assert.throws(() => {
            fibTypify.compileDirectoryTo(baseDir, customizedCopyDir, {
                extsToCopy: ['.txt', 'cpp', 'makefile']
            })
        })
        fibTypify.compileDirectoryTo(baseDir, customizedCopyDir, {
            extsToCopy: ['.txt'],
            includeLeveledGlobs: ['*', '!node_modules', 'glob_to_include', '!glob_to_exclude*']
        })

        assert.equal( fs.exists(path.resolve(customizedCopyDir, '1.txt')), true )
        assert.equal( fs.exists(path.resolve(customizedCopyDir, '2.json')), false )
        assert.equal( fs.exists(path.resolve(customizedCopyDir, '3.makefile')), false )
        assert.equal( fs.exists(path.resolve(customizedCopyDir, '4.cpp')), false )
        assert.equal( fs.exists(path.resolve(customizedCopyDir, 'node_modules')), false )

        assert.equal( fs.exists(path.resolve(customizedCopyDir, 'glob_to_include')), true )
        assert.equal( fs.exists(path.resolve(customizedCopyDir, 'glob_to_exclude123')), false )
    })
})

require.main === module && test.run(console.DEBUG)
