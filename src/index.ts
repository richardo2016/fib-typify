/// <reference path="../@types/index.d.ts" />

import vm = require('vm')

const compileModule = require('../core/module').compileModule
const compileRaw = require('../core/raw').compileRaw
const compileRawToFile = require('../core/raw').compileRawToFile
const compileRawToSandBox = require('../core/raw').compileRawToSandBox
const compileFile = require('../core/fs-file').compileFile
const compileFileTo = require('../core/fs-file').compileFileTo
const compileFileToSandBox = require('../core/fs-file').compileFileToSandBox
const compileDirectoryTo = require('../core/fs-directory').compileDirectoryTo
const loaderBox = require('../core/loader-box').defaultBox
const generateLoaderbox = require('../core/loader-box').generateLoaderbox
const builtModules = require('../core/_utils').builtModules
const registerTsCompiler = require('../core/_utils').registerTsCompiler
const defaultCompilerOptions = require('../core/_utils').defaultCompilerOptions

const defaultSandboxFallback = require('../core/_utils').defaultSandboxFallback

export = class ChainLoader implements FibTypify.ChainLoader {
    static default = ChainLoader;
    static compileModule = compileModule;
    static compileRaw = compileRaw;
    static compileRawToFile = compileRawToFile;
    static compileRawToSandBox = compileRawToSandBox;
    static compileFile = compileFile;
    static compileFileTo = compileFileTo;
    static compileFileToSandBox = compileFileToSandBox;
    static compileDirectoryTo = compileDirectoryTo;
    static loaderBox = loaderBox;
    static generateLoaderbox = generateLoaderbox;
    static builtModules = builtModules;
    static registerTsCompiler = registerTsCompiler;
    static defaultCompilerOptions = defaultCompilerOptions;

    static loader(...args: any[]): ChainLoader {
        const loader = new ChainLoader(args[0], args[1], args[2])
        return loader
    }

    private _sandbox: FibTypify.LoaderSandbox
    private _moduleOptions: any
    private _sourceMapConfig: any

    constructor(moduleOptions?, sourceMapConfig?, sandboxOptions?) {
        this._moduleOptions = this.setModuleOptions(moduleOptions);
        this._sourceMapConfig = this.setSourceMapConfig(sourceMapConfig);

        sandboxOptions && typeof sandboxOptions === 'object' && this.sandbox(sandboxOptions['modules'], sandboxOptions['fallback'], sandboxOptions['global'])
    }

    setModuleOptions (_moduleOptions) {
        this._moduleOptions = _moduleOptions || {}
    }

    setSourceMapConfig (_sourceMapConfig) {
        this._sourceMapConfig = _sourceMapConfig || {}
    }

    sandbox(...args: any[]) {
        if (this._sandbox)
            return this._sandbox

        if (args[0] instanceof vm.SandBox)
            this._sandbox = args.shift()
        else {
            const modules = { ...builtModules, ...args.shift() }
            let fallback = args.shift() || defaultSandboxFallback
            let _global = args.shift() || undefined

            this._sandbox = new vm.SandBox(modules, fallback, _global) as any
        }
        const loader = this
        Object.defineProperty(this._sandbox, 'loader', {
            value: function () {
                return loader
            }
        })

        const set_loader = args[3] || args[1]
        if (typeof set_loader === 'function')
            set_loader(this)

        registerTsCompiler(this._sandbox, null, this._moduleOptions, this._sourceMapConfig)

        return this.sandbox()
    }
}
