/// <reference types="@fibjs/types" />
import ts = require('typescript');
declare const compileModule: any;
declare const compileRaw: any, compileRawToFile: any, compileRawToSandBox: any;
declare const compileFile: any, compileFileTo: any, compileFileToSandBox: any;
declare const compileDirectoryTo: any;
declare const loaderBox: any;
declare const generateLoaderbox: any;
declare const builtModules: any;
declare const registerTsCompiler: any;
declare const defaultCompilerOptions: any;
interface LoaderSandbox extends Class_SandBox {
    loader(): ChainLoader;
}
interface SetLoaderCallback {
    (loader: ChainLoader): void;
}
export declare class ChainLoader {
    private _sandbox;
    private _moduleOptions;
    private _sourceMapConfig;
    constructor(moduleOptions?: any, sourceMapConfig?: any, sandboxOptions?: any);
    setModuleOptions(_moduleOptions: any): void;
    setSourceMapConfig(_sourceMapConfig: any): void;
    sandbox(): LoaderSandbox;
    sandbox(box: Class_SandBox | LoaderSandbox, func?: SetLoaderCallback): LoaderSandbox;
    sandbox(mods: object, require: Function, global: object, func?: SetLoaderCallback): LoaderSandbox;
}
export declare const createCompilerHost: (compilerOptions: ts.CompilerOptions) => ts.ProgramHost<ts.BuilderProgram>;
export declare const createProgram: (compilerOptions: ts.CompilerOptions, fileNames: string[], host: ts.ProgramHost<ts.BuilderProgram>) => ts.Program;
export { builtModules, registerTsCompiler, defaultCompilerOptions, compileModule, compileRaw, compileRawToFile, compileRawToSandBox, compileFile, compileFileTo, compileFileToSandBox, compileDirectoryTo, loaderBox, generateLoaderbox, };
export declare function loader(...args: any[]): ChainLoader;
