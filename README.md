# fib-typify

[![NPM version](https://img.shields.io/npm/v/fib-typify.svg)](https://www.npmjs.org/package/fib-typify)
[![Build Status](https://travis-ci.com/richardo2016/fib-typify.svg?branch=master)](https://travis-ci.org/richardo2016/fib-typify)
[![Build status](https://ci.appveyor.com/api/projects/status/lmp5jopw8m149v9h?svg=true)](https://ci.appveyor.com/project/richardo2016/fib-typify)

just write fibjs with typescript : )

## Pre-requisite

- fibjs `>= 0.26.0`

## Usage

```javascript
// entry.js
const vm = require('vm')
const typify = require('fib-typify')

typify.loader({
    compilerOptions: {
        inlineSourceMap: true
    }
}).sandbox().require('./index.ts', __dirname)

// index.ts
export function foo (str: string): string {
    return `hello, ${str}`
}
```

## Introduction
`fib-typify` allows you write fibjs with [typescript] in compilation or in runtime. It depends on original [typescript] stable version. As typescript is written with **nodejs**, it's not restricted in nodejs runtime: you can also compile typescript in browser or _ANY_ other pure Javascript runtime. That is, you can use it in fibjs also.

## renderer
`fib-typify`'s core is [jstransformer-typescript]-like ([jstransformer-typescript] is one [jstransformer] aimed to typescript), but this core is only valid in fibjs rather than pure javascript

## Usage

```bash
# locally
fibjs --install fib-typify
# or globally
npm i -g fib-typify

# compile code in ./src to ./dist recursively
fib-typify ./src -o ./dist
```

## default tsCompilerOptions

### internal default compilerOptions
```javascript
{
    target: 'es6',
    module: 'commonjs',
    noImplicitUseStrict: true
}
```

### `tsconfig.json`

Start from `0.4.0`, `compilerOptions` from `CWD/tsconfig.json` would overwrite internal default compilerOptions.

### priority of overwriting

1. compilerOptions passed to `function params`
1. compilerOptions in `tsconfig.json`
1. internal default compilerOptions

### Baisc Usage

* `loader(moduleOptions: any, sourceMapConfig: any, sandBoxCfg?: SandBoxInitialConfig): ChainLoader`

generate one [ChainLoader]

* `loader().sandbox(mods: object, require: Function, global: object, func?: SetLoaderCallback): Class_SandBox`

generate one [ChainLoader]'s sandbox


### Advanced APIs

**NOTE** All `TSCompilerOptions` is just typescript's [compilerOptions]

---

* `compileRaw: (tsRaw: string, tsCompilerOptions: TSCompilerOptions) => string`

compile `tsRaw` to javascript.

* `compileRawToFile: (tsRaw: string, targetpath: string, tsCompilerOptions: TSCompilerOptions) => void`

compile `tsRaw` to javascript, then write to `targetpath`.

* `compileFile: (filepath?: string, tsCompilerOptions: TSCompilerOptions) => string`

compile content in `filepath` to javascript.

* `compileFileTo: (srcpath?: string, targetpath: string, tsCompilerOptions: TSCompilerOptions) => void`

compile content in `filepath` to javascript, then write to `targetpath`.

* `compileDirectoryTo: (baseDir: string, distDir: string, directoryCompilationOptions: any) => void`

| Param | Type | Required/Default |
| -------- | -------- | -------- |
| baseDir   | string   | Y / -   |
| distDir   | string   | Y / -   |
| directoryCompilationOptions | [directoryCompilationOptions] | N / - |

compile files in directory `baseDir` recursively to `distDir`, view options in view [directoryCompilationOptions].

* `generateLoaderbox(tsCompilerOptions: TSCompilerOptions, basedir: string)`

generate one loaderBox with compilation options `tsCompilerOptions`.

* `registerTsCompiler(sandbox: vm.SandBox, tsCompilerOptions: TSCompilerOptions = defaultCompilerOptions)`

register '.ts' compiler for one Sanbox which haven't been registered before.

* `loaderBox`

default loaderBox of `fib-typify`, it use **default tsCompilerOptions** as compiler options for `.ts`.

* `defaultCompilerOptions`

default typescript compiler options. More detail in [typescript's compiler options]

---

### directoryCompilationOptions

| Field | Type | Required/Default | Explanation |
| -------- | -------- | -------- | --------- |
| compilerOptions   | boolean   | Y / `false`    | typescript's [compilerOptions] |
| fileglobsToCopy | Array, '*' | N / `['*.js', '*.jsc', '*.json']` | whitelist for extensions of globnames to copy when recursive walk to one
| includeLeveledGlobs | string | string[] | N / `['*', '!node_modules', '!.ts']` | glob descriptor list to exclude on walk to every directory level, view detail in [micromatch] |
| filterFileName   | (filename: string): boolean   | N / -    | whether compile File, file would be compiled if returning `true` |

<!-- | extsToCopy | Array, '*' | N / `['.js', '.jsc', '.json']` | whitelist for extensions of filename to copy when recursive walk to one file -->
**notice** `directoryCompilationOptions.extsToCopy` is depreacated, if you pass it,`directoryCompilationOptions.fileglobsToCopy` get invalid.

## loaderBox

loaderBox is one new feature started from fib-typify`>= 0.3`, it depends on new API `Sandbox::setModuleCompiler` in fibjs`>= 0.26.0`, but it also work in fibjs `>= 0.22.0 < 0.26.0 ` **partly**

### require typescript directly by default loaderBox

```javascript
// default-loader.js
const Typify = require('fib-typify')

const module = Typify.loaderBox.require('./index.ts', __dirname)
```

### require typescript directly by customized loaderBox
```javascript
// customized-loader.js
const Typify = require('fib-typify')

const loaderBox = Typify.loader({
    compilerOptions: {
        ...Typify.defaultCompilerOptions,
        // enable some options as you like
        strict: true,
        diagnostics: true,
        allowJs: true,
    }
}).sandbox()

const module = loaderBox.require('./index.ts', __dirname)
```

### File Filter Priority

High -> Low:
1. includeLeveledGlobs
1. fileglobsToCopy
1. filterFileName

### File Writing Priority
1. [compileResult]
1. fileglobsToCopy

## CLI
Started from `0.2.0`, you can run `fib-typify` in CLI.

```bash
# compile, source directory(such as `src` above) is required
fib-typify src -o lib -c .typify.json

# run .ts script directly
fib-typify ./src/index.ts

# or compile it to same directory with corresponding filename
fib-typify ./src/index.ts -o # get compiled script `./script/index.js`

# or compile one file to specified position
fib-typify ./src/index.ts -o /tmp/a.js # get compiled script `/tmp/a.js`

# run index script directly
fib-typify ./ # which would from `./index.ts`, main script in `package.json`, './index.js', './index.json'...
fib-typify ./src
```

Command above means compiling directory `src` to directory `lib` with configuration file `.typify.json`, which would be passed to `typescript.transpile(options)`.

I only provided one simple and crude error exception mechanism, so in some cases it may be not friendly as you like, it's welcome to take PR to help optimizting this part of `fib-typify` :)

### options

`-c, --config-file`: equals to `tsconfig.compilerOptions`, would overwrite the one from `tsconfig.json`

`-o, --out-dir`: equals to `tsconfig.outDir`, would overwrite the one from `tsconfig.json`

## Warning

### `loaderBox` Limitations when `fibjs < 0.25.0`
From fibjs `0.26.0`, fibjs supports `setModuleCompiler` API to customize compiler for specified extension, so we can require typescript file directly by providing compiler for `.ts` file, which provided by fib-typify's `loaderBox`.

fib-typify also support `loaderBox` feature in lower version fibjs(`< 0.25.0`), but not full-feature support, so there are some advices for your application depending on fib-typify in fibjs(`< 0.25.0`):

- always add `.ts` suffix in `require` and `import` statement(**ESPECIALLY** when you run typescript by `fib-typify` CLI directly!)
- don't `export interface` in pure `.ts` file
- dont't write loop-requirement with import statement in `.ts`, if you really do it, write `exports.xxx = ...` instead of `export const xxx = ...` in the loop requirement.

so it's better to upgrade fibjs to version`>=0.25.0`, best to `>=0.26.0`, which resolves typescript source faster than previous version fibjs in fib-typify.

### compile `.ts` to `.js` before your deploy

By the way, although I have tested in some cases, but it's not enough to improve "fib-typify's loaderBox can run in production directly". In my own work, I use fib-typify's loaderBox to load all source code when app's in developing stage, but I would
compile source to **pure javascript** code before publishing.

Just use command `fib-typify ./src -o ./dist`, or use fib-typify's compile* API to build your source code. Get more samples [here](/test/spec.fs-directory.js)

## Contributions

If you wanna contribute to this package, just learn about [fibjs] first, then fork this repo :)

[typescript]:https://github.com/Microsoft/TypeScript
[fibjs]:http://fibjs.org/
[jstransformer-typescript]:https://github.com/jstransformers/jstransformer-typescript
[jstransformer]:https://github.com/jstransformers/jstransformer

[compilerOptions]:https://www.typescriptlang.org/docs/handbook/compiler-options.html
[directoryCompilationOptions]:#directoryCompilationOptions
[micromatch]:https://github.com/micromatch/micromatch#options
[typescript's compiler options]:https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
[ChainLoader]:./@types/index.d.ts
