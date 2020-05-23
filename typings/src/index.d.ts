/// <reference types="@fibjs/types" />
interface LoaderSandbox extends Class_SandBox {
    loader(): ChainLoader;
}
interface SetLoaderCallback {
    (loader: ChainLoader): void;
}
export declare class ChainLoader {
    static default: typeof ChainLoader;
    static compileModule: any;
    static compileRaw: any;
    static compileRawToFile: any;
    static compileRawToSandBox: any;
    static compileFile: any;
    static compileFileTo: any;
    static compileFileToSandBox: any;
    static compileDirectoryTo: any;
    static loaderBox: any;
    static generateLoaderbox: any;
    static builtModules: any;
    static registerTsCompiler: any;
    static defaultCompilerOptions: any;
    static loader(...args: any[]): ChainLoader;
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
declare const createProgram: any, createCompilerHost: any;
export { createProgram, createCompilerHost };
