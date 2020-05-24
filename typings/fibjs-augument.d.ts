/// <reference types="@fibjs/types" />

declare namespace FibTypify {
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
}
