exports.compileRaw = require('./lib/raw').compileRaw
exports.compileRawToFile = require('./lib/raw').compileRawToFile
exports.compileRawToSandBox = require('./lib/raw').compileRawToSandBox

exports.compileFile = require('./lib/fs-file').compileFile
exports.compileFileTo = require('./lib/fs-file').compileFileTo
exports.compileFileToSandBox = require('./lib/fs-file').compileFileToSandBox

exports.compileDirectoryTo = require('./lib/fs-directory').compileDirectoryTo

exports.loaderBox = require('./lib/loader-box').defaultBox
exports.generateLoaderbox = require('./lib/loader-box').generateLoaderbox

exports.builtModules = require('./lib/_utils').builtModules
exports.registerTsCompiler = require('./lib/_utils').registerTsCompiler
exports.defaultCompilerOptions = require('./lib/_utils').tsCompilerOptions
