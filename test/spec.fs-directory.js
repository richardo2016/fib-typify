const test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')

const Typify = require('../')

const compilerOptions1 = {
    target: 'es6',
    module: 'commonjs'
}
const compilerOptions2 = {
    target: 'es5',
    module: 'commonjs'
}
const compilerOptionsJsx = {
    target: 'es6',
    module: 'commonjs',
    jsx: "react"
}

const distDirPath = path.resolve(__dirname, 'dist')

try {
    fs.unlink(distDir)
} catch (e) {}

describe('fs-directory', () => {
    it('compileDirectoryTo', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(distDirPath, './directory')

        Typify.compileDirectoryTo(baseDir, distDir)
    })

    it('compileDirectoryTo with filename', () => {
        const inputfile = path.resolve(__dirname, './ts/basic.ts')
        const distfile = path.resolve(__dirname, './ts/basic.js')
        const customdist = path.resolve(__dirname, './dist/lalala/basic.js')

        ;[
            [false, inputfile, undefined, distfile],
            [false, inputfile, inputfile, distfile],
            [true, inputfile, distfile, distfile],
            [true, inputfile, customdist, customdist],
        ].forEach(([assert_require, f, d, expected_d]) => {
            Typify.compileDirectoryTo(f, d)

            assert.equal( fs.exists(expected_d), true )

            if (assert_require) {
                assert.isObject(require(expected_d))
                assert.isFunction(require(expected_d).add)
                assert.isFunction(require(expected_d).http)
                assert.isFunction(require(expected_d).hello)
            }

            try {
                fs.exists(expected_d) && fs.unlink(expected_d)
            } catch (e) {
                console.error(e.stack)
            }
        })
    })

    it('compileDirectoryTo with compilerOptions1', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(distDirPath, './directory1')

        Typify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptions1 })
    })

    it('compileDirectoryTo with compilerOptions2', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(distDirPath, './directory2')

        Typify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptions2 })
    })

    describe('compileDirectoryTo with compilerOptionsJsx', () => {
        it('default', () => {
            const baseDir = path.resolve(__dirname, './tsx')
            const distDir = path.resolve(distDirPath, './directory-jsx')

            Typify.compileDirectoryTo(baseDir, distDir, { compilerOptions: compilerOptionsJsx })

            assert.equal( fs.exists(path.resolve(distDir, 'react-dom.js')), true )
            assert.ok( fs.readTextFile(path.resolve(distDir, 'react-dom.js')).includes(`React.createElement`))
            assert.equal( fs.exists(path.resolve(distDir, 'react-dom.jsx')), false )

            assert.equal( fs.exists(path.resolve(distDir, 'noop.js')), true )
            assert.ok( fs.readTextFile(path.resolve(distDir, 'noop.js')).includes(`React.createElement(React.Fragment`))
        })

        it('jsxFactory: "React.createElement"', () => {
            const baseDir = path.resolve(__dirname, './tsx')
            const distDir = path.resolve(distDirPath, './directory-jsx1')

            Typify.compileDirectoryTo(baseDir, distDir, { compilerOptions: {...compilerOptionsJsx, jsxFactory: 'React.createElement'} })

            assert.equal( fs.exists(path.resolve(distDir, 'noop.js')), true )
            assert.ok( fs.readTextFile(path.resolve(distDir, 'noop.js')).includes(`React.createElement(React.Fragment`))
        })
    })


    const baseDir = path.resolve(__dirname, './dir_to_copy')

    it('compileDirectoryTo with other files: default_copy', () => {
        const defaultCopyDir = path.resolve(distDirPath, './default_copy')

        Typify.compileDirectoryTo(baseDir, defaultCopyDir)
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '1.txt')), false )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '2.json')), true )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '3.makefile')), false )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, '4.cpp')), false )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, 'glob_to_include')), true )
        assert.equal( fs.exists(path.resolve(defaultCopyDir, 'glob_to_exclude123')), false )
    })

    it('compileDirectoryTo with other files: allcopystrategy_copy', () => {
        const allCopyStrategyDir = path.resolve(distDirPath, './allcopystrategy_copy')
        Typify.compileDirectoryTo(baseDir, allCopyStrategyDir, {
            fileglobsToCopy: ['*'],
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
        Typify.compileDirectoryTo(baseDir, customizedCopyDir, {
            fileglobsToCopy: ['*.txt'],
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
