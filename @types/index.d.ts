declare namespace FibTypify {
    interface LoaderSandbox extends Class_SandBox {
        loader(): ChainLoader
    }

    interface SandBoxConstructor<T = any> {
        (mods: object): T;
        (mods: object, require: Function): T;
        (mods: object, global: object): T;
        (mods: object, require: Function, global: object): T;
    }

    interface SandBoxInitialConfig {
        modules: object
        fallback: Function
        global: object
    }

    interface SetLoaderCallback {
        (loader: ChainLoader): void
    }

    interface SandBoxApi extends SandBoxConstructor<LoaderSandbox> {
        (): LoaderSandbox
        (box: Class_SandBox | LoaderSandbox, func?: SetLoaderCallback): LoaderSandbox
        (mods: object, require: Function, global: object, func?: SetLoaderCallback): LoaderSandbox
    }

    class ChainLoader {
        // advanced api :start
        static compileModule: Function
        static compileRaw: Function
        static compileRawToFile: Function
        static compileRawToSandBox: Function
        static compileFile: Function
        static compileFileTo: Function
        static compileFileToSandBox: Function
        static compileDirectoryTo: Function
        static loaderBox: Function
        static generateLoaderbox: Function
        static builtModules: Function
        static registerTsCompiler: Function
        static defaultCompilerOptions: Function
        // advanced api :end

        static loader(moduleOptions: any, sourceMapConfig: any, sandBoxCfg?: SandBoxInitialConfig): ChainLoader
        static sandbox: SandBoxConstructor<LoaderSandbox>
        sandbox: SandBoxApi
    }
}

declare module "fib-typify" {
    export = FibTypify.ChainLoader
}
