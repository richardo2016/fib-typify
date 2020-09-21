/**
 * @warning internal.ts is some apis used internally only in fib-typify, we expose them
 * for `bin/*.js`, never dependes it in you App.
 */
import * as ts from 'typescript';
export declare function watch(rootFileNames: string[], options: ts.CompilerOptions, workDir?: string): void;
