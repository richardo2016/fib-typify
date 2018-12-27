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

    interface SandBoxApi extends SandBoxConstructor<Class_SandBox> {
        (): Class_SandBox
        (box: Class_SandBox, func?: SetLoaderCallback): Class_SandBox
        (mods: object, require: Function, global: object, func?: SetLoaderCallback): Class_SandBox
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
        static sandbox: SandBoxConstructor<Class_SandBox>
        sandbox: SandBoxApi
    }
}

declare module "fib-typify" {
    export default FibTypify.ChainLoader
}
