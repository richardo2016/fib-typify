const test = require('test');
test.setup();

const fs = require('fs')
const path = require('path')
const os = require('os')
const ts = require('typescript')

const Typify = require('../')

describe('ts-intf', () => {
    describe('properties in ts.sys', () => {
        it('keys', () => {
            assert.deepEqual(Object.keys(ts.sys), [
                'args',
                'newLine',
                'useCaseSensitiveFileNames',
                'write',
                'getWidthOfTerminal',
                'writeOutputIsTTY',
                'readFile',
                'writeFile',
                'watchFile',
                'watchDirectory',
                'resolvePath',
                'fileExists',
                'directoryExists',
                'createDirectory',
                'getExecutingFilePath',
                'getCurrentDirectory',
                'getDirectories',
                'getEnvironmentVariable',
                'readDirectory',
                'getModifiedTime',
                'setModifiedTime',
                'deleteFile',
                'createHash',
                'createSHA256Hash',
                'getMemoryUsage',
                'getFileSize',
                'exit',
                'enableCPUProfiler',
                'disableCPUProfiler',
                'cpuProfilingEnabled',
                'realpath',
                'debugMode',
                'tryEnableSourceMapsForHost',
                'setTimeout',
                'clearTimeout',
                'clearScreen',
                'setBlocking',
                'bufferFrom',
                'base64decode',
                'base64encode',
                'require',
            ]);
        });

        it('property type', () => {
            assert.isArray(ts.sys.args);
            assert.equal(ts.sys.newLine, os.EOL);

            assert.isBoolean(ts.sys.useCaseSensitiveFileNames);

            assert.isFunction(ts.sys.write);
            assert.isFunction(ts.sys.getWidthOfTerminal);

            assert.isFunction(ts.sys.writeOutputIsTTY);
            assert.isFunction(ts.sys.readFile);
            assert.isFunction(ts.sys.writeFile);
            assert.isFunction(ts.sys.watchFile);
            assert.isFunction(ts.sys.watchDirectory);
            assert.isFunction(ts.sys.resolvePath);
            assert.isFunction(ts.sys.fileExists);
            assert.isFunction(ts.sys.directoryExists);
            assert.isFunction(ts.sys.createDirectory);
            assert.isFunction(ts.sys.getExecutingFilePath);
            assert.isFunction(ts.sys.getCurrentDirectory);
            assert.isFunction(ts.sys.getDirectories);
            assert.isFunction(ts.sys.getEnvironmentVariable);
            assert.isFunction(ts.sys.readDirectory);
            assert.isFunction(ts.sys.getModifiedTime);
            assert.isFunction(ts.sys.setModifiedTime);
            assert.isFunction(ts.sys.deleteFile);
            assert.isFunction(ts.sys.createHash);
            assert.isFunction(ts.sys.createSHA256Hash);
            assert.isFunction(ts.sys.getMemoryUsage);
            assert.isFunction(ts.sys.getFileSize);
            assert.isFunction(ts.sys.exit);
            assert.isFunction(ts.sys.enableCPUProfiler);
            assert.isFunction(ts.sys.disableCPUProfiler);
            assert.isFunction(ts.sys.cpuProfilingEnabled);
            assert.isFunction(ts.sys.realpath);

            assert.isBoolean(ts.sys.debugMode);

            assert.isFunction(ts.sys.tryEnableSourceMapsForHost);
            assert.isFunction(ts.sys.setTimeout);
            assert.isFunction(ts.sys.clearTimeout);
            assert.isFunction(ts.sys.clearScreen);
            assert.isFunction(ts.sys.setBlocking);
            assert.isFunction(ts.sys.bufferFrom);
            assert.isFunction(ts.sys.base64decode);
            assert.isFunction(ts.sys.base64encode);
            assert.isFunction(ts.sys.require);
        });
    });

    describe('compilerHost properties', () => {
        const host = Typify.createCompilerHost({});

        it('keys', () => {
            assert.deepEqual(Object.keys(host), [
                'getSourceFile',
                'getDefaultLibLocation',
                'getDefaultLibFileName',
                'writeFile',
                'getCurrentDirectory',
                'useCaseSensitiveFileNames',
                'getCanonicalFileName',
                'getNewLine',
                'fileExists',
                'readFile',
                'trace',
                'directoryExists',
                'getEnvironmentVariable',
                'getDirectories',
                'realpath',
                'readDirectory',
                'createDirectory',
                'createHash'
            ]);
        });

        it('ModuleResolutionHost#fileExists', () => {
            assert.equal(host.fileExists(__filename), true);
        });

        it.skip('ModuleResolutionHost#readFile', () => {

        });

        it.skip('ModuleResolutionHost#trace', () => {

        });

        it('ModuleResolutionHost#directoryExists', () => {
            assert.equal(host.directoryExists(__dirname), true);
        });

        it.skip('ModuleResolutionHost#realpath', () => {

        });

        it('ModuleResolutionHost#getCurrentDirectory', () => {
            assert.equal(host.getCurrentDirectory(), process.cwd());
        });

        it.skip('ModuleResolutionHost#getDirectories', () => {
        });

        it.skip('realpath', () => {
        })

        if (process.stdout.isTTY) {
            it('ts.sys.getWidthOfTerminal', () => {
                assert.isNumber(ts.sys.getWidthOfTerminal());
            })
        }
    });
})

require.main === module && test.run(console.DEBUG)
