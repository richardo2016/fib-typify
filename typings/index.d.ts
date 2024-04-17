/// <reference types="@fibjs/types" />
import ts = require('typescript');
declare const compileModule: any;
declare const compileRaw: any, compileRawToFile: any, compileRawToSandBox: any;
declare const compileFile: any, compileFileTo: any, compileFileToSandBox: any;
declare const compileDirectoryTo: any;
/**
 * @deprecated
 */
declare const loaderBox: any;
/**
 * @deprecated
 */
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
interface SandBoxInitialConfig {
    modules: object;
    fallback: Function;
    global: object;
}
declare type IClazzConstructorParams<T> = T extends {
    new (...args: infer U): any;
} ? U : (T extends {
    new (...args: infer U): any;
} ? U : never);
export declare class ChainLoader {
    private _sandbox;
    private _moduleOptions;
    constructor(moduleOptions?: ChainLoader['_moduleOptions'], sandboxOptions?: SandBoxInitialConfig);
    setModuleOptions(_moduleOptions: ChainLoader['_moduleOptions']): void;
    sandbox(): LoaderSandbox;
    sandbox(box: Class_SandBox | LoaderSandbox, func?: SetLoaderCallback): LoaderSandbox;
    sandbox(mods: object, require: Function, global: object, func?: SetLoaderCallback): LoaderSandbox;
}
export declare const createCompilerHost: (compilerOptions: ts.CompilerOptions) => ts.ProgramHost<ts.BuilderProgram>;
export declare const createProgram: (compilerOptions: ts.CompilerOptions, fileNames: string[], host: ts.ProgramHost<ts.BuilderProgram>) => ts.Program;
export { builtModules, registerTsCompiler, defaultCompilerOptions, compileModule, compileRaw, compileRawToFile, compileRawToSandBox, compileFile, compileFileTo, compileFileToSandBox, compileDirectoryTo, loaderBox, generateLoaderbox, };
/**
 * @deprecated
 */
export declare function loader(...args: IClazzConstructorParams<typeof ChainLoader>): ChainLoader;
