/// <reference types="@fibjs/types" />

import vm = require('vm')
import ts = require('typescript')

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

/**
 * @deprecated
 */
const loaderBox = require('../core/loader-box').defaultBox
/**
 * @deprecated
 */
const generateLoaderbox = require('../core/loader-box').generateLoaderbox

const builtModules = require('../core/_utils').builtModules
const registerTsCompiler = require('../core/_utils').registerTsCompiler
const defaultCompilerOptions = require('../core/_utils').defaultCompilerOptions

const defaultSandboxFallback = name => require(name)

interface LoaderSandbox extends Class_SandBox {
    loader(): ChainLoader
}

interface SetLoaderCallback {
    (loader: ChainLoader): void
}
interface SandBoxInitialConfig {
    modules: object
    fallback: Function
    global: object
}

type IClazzConstructorParams<T> = T extends {
    new (...args: infer U): any
} ? U : (
T extends {
    new (...args: infer U): any
} ? U : never
)

export class ChainLoader {
    private _sandbox: ChainLoader
    private _moduleOptions: {
        compilerOptions?: ts.CompilerOptions
    }

    constructor(
        moduleOptions: ChainLoader['_moduleOptions'] = {},
        sandboxOptions?: SandBoxInitialConfig
    ) {
        this.setModuleOptions(moduleOptions);

        sandboxOptions && typeof sandboxOptions === 'object' && this.sandbox(sandboxOptions['modules'], sandboxOptions['fallback'], sandboxOptions['global'])
    }

    setModuleOptions (_moduleOptions: ChainLoader['_moduleOptions']) {
        this._moduleOptions = _moduleOptions || {}
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

        registerTsCompiler(this._sandbox, this._moduleOptions?.compilerOptions)

        return this.sandbox()
    }
}

const programApis = require('../core/ts-apis/program')
export const createCompilerHost = programApis.createCompilerHost as (compilerOptions: ts.CompilerOptions) => ts.ProgramHost<ts.BuilderProgram>
export const createProgram = programApis.createProgram as (compilerOptions: ts.CompilerOptions, fileNames: string[], host: ts.ProgramHost<ts.BuilderProgram>) => ts.Program

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
/**
 * @deprecated
 */
export function loader(...args: IClazzConstructorParams<typeof ChainLoader>): ChainLoader {
    const loader = new ChainLoader(args[0], args[1])
    return loader
}
