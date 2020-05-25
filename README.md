# fib-typify

[![NPM version](https://img.shields.io/npm/v/fib-typify.svg)](https://www.npmjs.org/package/fib-typify)
[![Build Status](https://travis-ci.com/richardo2016/fib-typify.svg?branch=master)](https://travis-ci.org/richardo2016/fib-typify)
[![Build status](https://ci.appveyor.com/api/projects/status/lmp5jopw8m149v9h?svg=true)](https://ci.appveyor.com/project/richardo2016/fib-typify)

🚀 Just coding fibjs program with typescript
 
## Introduction**
`fib-typify` allows you to write fibjs with [typescript] at compilation or at runtime. It depends on official [typescript]'s [internal compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API).

As typescript is written with **nodejs**, it's not restricted in nodejs runtime only --- you can also compile typescript in browser or _ANY_ other pure Javascript runtime. That is, you can use it in fibjs also.

## Pre-requisites

- fibjs `>= 0.27.0`

## Usage

```bash
# locally
npm i -S fib-typify
# or globally
npm i -g fib-typify
```

**Via Javascript**

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

**Via CLI**

#### `fstc`

Started from `0.8.0`, you can run `ftsc`, it's command line like `tsc` from typescript, but it's for fibjs.

```bash
# compile, source directory(such as `src/*` below) is required
./node_modules/.bin/ftsc src/* --outDir lib
```

Most general options of `tsc` are supported:

- `--target`
- `--module`
- `--moduleResolution`
- **`--jsx`**
- **`--declaration`**
- `--declarationDir`
- `--emitDeclarationOnly`
- **`--outDir`**
- `--allowJs`
- `--noEmit`
- ...

You can just pass those options to `ftsc` as arguments(flags), just like what you did with `tsc`.

```bash
# compile your project's source to `lib` directory, with dts files emitted 🚀
ftsc ./src/* \ 
    --outDir ./lib \
    --declaration \
    --declarationDir ./typings \
    --allowJs
```

#### `fib-typify`(deprecated)

Run .ts script directly.

```bash
./node_modules/.bin/fib-typify ./src/index.ts
```

Command above means compiling directory `src` to directory `lib` with configuration file `.typify.json`, which would be passed to `typescript.transpileModule(input, moduleOptions)` as 2nd param `moduleOptions`.

<!-- Or compile it to same directory with corresponding filename
```bash
# get compiled script `./script/index.js`
fib-typify ./src/index.ts -o
``` -->

<!-- Or compile one file to specified position
```bash
# get compiled script `/tmp/a.js`
fib-typify ./src/index.ts -o /tmp/a.js
``` -->

run valid resolvable script directly.

```bash
## which would try to run `./index.ts`, main script in `package.json`, './index.js', './index.json'...
fib-typify ./

## run `./src/index.js`, `./src/index.ts`, ...
fib-typify ./src
```

I only provided simple and crude error exception mechanism, so in some cases the error emitted may be not friendly as you like, it's welcome to take PR to help optimizting this part of `fib-typify` :)

**options**

`-c, --config-file`: equals to `tsconfig.compilerOptions`, would overwrite the one from `tsconfig.json`

`-o, --out`: (fallback to file when necessary,) equals to `tsconfig.outDir`, would overwrite the one from `tsconfig.json`

## default tsCompilerOptions

### internal default compilerOptions
```javascript
{
    target: 'es6',
    module: 'commonjs',
    noImplicitUseStrict: true
}
```

### Baisc Usage

* `loader(moduleOptions: any, sandBoxCfg?: SandBoxInitialConfig): ChainLoader`

generate one [ChainLoader]

* `loader().sandbox(mods: object, require: Function, global: object, func?: SetLoaderCallback): Class_SandBox`

generate one [ChainLoader]'s sandbox


### Advanced APIs

**NOTE** All `TSCompilerOptions` is just typescript's [compilerOptions]

---

* `generateLoaderbox(tsCompilerOptions: TSCompilerOptions, basedir: string)`

generate one loaderBox with compilation options `tsCompilerOptions`.

* `registerTsCompiler(sandbox: vm.SandBox, tsCompilerOptions: TSCompilerOptions = defaultCompilerOptions)`

register '.ts' compiler for one Sanbox which haven't been registered before.

* `loaderBox`

default loaderBox of `fib-typify`, it use **default tsCompilerOptions** as compiler options for `.ts`.

* `defaultCompilerOptions`

default typescript compiler options. More detail in [typescript's compiler options]

---

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

## Warning

### `loaderBox` Limitations when `fibjs < 0.25.0`

**NOTE** it's **NOT** recommended to use fib-typify in fibjs <= 0.26.x.

From fibjs `0.26.0`, fibjs supports `setModuleCompiler` API which allow to customize compiler for module with explicit extension, so we can require typescript file directly by providing compiler for `.ts` file, which provided by fib-typify's `loaderBox`.

fib-typify also support `loaderBox` feature in lower version fibjs(`< 0.25.0`), but not full-feature support, so there are some advices for your application depending on fib-typify in fibjs(`< 0.25.0`):

- always add `.ts` suffix in `require` and `import` statement(**ESPECIALLY** when you run typescript by `fib-typify` CLI directly!)
- don't `export interface` in pure `.ts` file
- dont't write loop-requirement with import statement in `.ts`, if you really do it, write `exports.xxx = ...` instead of `export const xxx = ...` in the loop requirement.

so it's better to upgrade fibjs to version`>=0.25.0`, best to `>=0.26.0`, which resolves typescript source faster than previous version fibjs in fib-typify.

### compile `.ts` to `.js` before your deployment

By the way, although I have tested in some cases, but it's not enough to improve "fib-typify's loaderBox can run in production directly". In my own work, I use fib-typify's loaderBox to load all source code when app's in developing stage, but I would
compile source to **pure javascript** code before publishing.

Just use command  `ftsc ./src/* --outDir ./lib --declaration` to compile your source codes, shipped with all dts files :)

## Contributors ✨

If you wanna contribute to this package, just learn about [fibjs] first, then fork this repo :)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://js.chenlei.me"><img src="https://avatars0.githubusercontent.com/u/6339390?v=4" width="100px;" alt=""/><br /><sub><b>Ray</b></sub></a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

[typescript]:https://github.com/Microsoft/TypeScript
[fibjs]:http://fibjs.org/
[jstransformer-typescript]:https://github.com/jstransformers/jstransformer-typescript
[jstransformer]:https://github.com/jstransformers/jstransformer

[compilerOptions]:https://www.typescriptlang.org/docs/handbook/compiler-options.html
[directoryCompilationOptions]:#directoryCompilationOptions
[micromatch]:https://github.com/micromatch/micromatch#options
[typescript's compiler options]:https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
[ChainLoader]:./@types/index.d.ts
