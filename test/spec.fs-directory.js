const vm = require('vm')

const fs = require('fs')
const path = require('path')

const fibTypify = require('../')

describe('fs-directory', () => {
    it('compileDirectoryTo', () => {
        const baseDir = path.resolve(__dirname, './ts')
        const distDir = path.resolve(__dirname, './dist/directory')

        fibTypify.compileDirectoryTo(baseDir, distDir)
    })
})
