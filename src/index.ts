/// <reference types="@fibjs/types" />

import vm = require('vm')

const compileModule = require('../core/transpile/module').compileModule
const {
    compileRaw,
    compileRawToFile,
    compileRawToSandBox,
} = require('../core/transpile/raw')

const {
    compileFile,
    compileFileTo,
    compileFileToSandBox,
} = require('../core/transpile/fs-file')

const {
    compileDirectoryTo
} = require('../core/transpile/fs-directory')

const loaderBox = require('../core/loader-box').defaultBox
const generateLoaderbox = require('../core/loader-box').generateLoaderbox

const builtModules = require('../core/_utils').builtModules
const registerTsCompiler = require('../core/_utils').registerTsCompiler
const defaultCompilerOptions = require('../core/_utils').defaultCompilerOptions

const defaultSandboxFallback = require('../core/_utils').defaultSandboxFallback

interface LoaderSandbox extends Class_SandBox {
    loader(): ChainLoader
}

interface SetLoaderCallback {
    (loader: ChainLoader): void
}

export class ChainLoader {
    private _sandbox: ChainLoader
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

    sandbox(): LoaderSandbox
    sandbox(box: Class_SandBox | LoaderSandbox, func?: SetLoaderCallback): LoaderSandbox
    sandbox(mods: object, require: Function, global: object, func?: SetLoaderCallback): LoaderSandbox

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

const { createProgram, createCompilerHost } = require('../core/ts-apis/program')
export { createProgram, createCompilerHost }

export {
    builtModules,
    registerTsCompiler,
    defaultCompilerOptions,

    compileModule,
    compileRaw,
    compileRawToFile,
    compileRawToSandBox,
    compileFile,
    compileFileTo,
    compileFileToSandBox,
    compileDirectoryTo,
    
    loaderBox,
    generateLoaderbox,
};

export function loader(...args: any[]): ChainLoader {
    const loader = new ChainLoader(args[0], args[1], args[2])
    return loader
}