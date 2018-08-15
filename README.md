# fib-typify

[![Build Status](https://travis-ci.com/richardo2016/fib-typify.svg?branch=master)](https://travis-ci.org/richardo2016/fib-typify)
[![NPM version](https://img.shields.io/npm/v/fib-typify.svg)](https://www.npmjs.org/package/fib-typify)

just write fibjs with typescript : )

## Introduction
`fib-typify` allows you write fibjs with [typescript] in compilation or in runtime. It depends on original [typescript] stable version. As typescript is written with **nodejs**, it's not restricted in nodejs runtime: you can also compile typescript in browser or _ANY_ other pure Javascript runtime. That is, you can use it in fibjs also.

## renderer
`fib-typify`'s core is [jstransformer-typescript] (which is one [jstransformer] aimed to typescript) like, but this core is only valid in fibjs rather than pure javascript

## Usage

```bash
# locally
fibjs --install fib-typify
# or globally
npm i -g fib-typify
```

### APIs

**NOTE** All `TSCompilerOptions` is just typescript's [compilerOptions]

---

* `compileRaw: (tsRaw: string, tsCompilerOptions: TSCompilerOptions) => string`

compile `tsRaw` to javascript.

* `compileRawToFile: (tsRaw: string, targetpath: string, tsCompilerOptions: TSCompilerOptions) => void`

compile `tsRaw` to javascript, then write to `targetpath`

* `compileRawToSandBox: (tsRaw: string, sboxOpts: any, tsCompilerOptions: TSCompilerOptions) => any`

compile `tsRaw` to javascript, then read it as sandbox

* `compileFile: (filepath?: string, tsCompilerOptions: TSCompilerOptions) => string`

compile content in `filepath` to javascript.

* `compileFileTo: (srcpath?: string, targetpath: string, tsCompilerOptions: TSCompilerOptions) => void`

compile content in `filepath` to javascript, then write to `targetpath`

* `compileFileToSandBox: (filepath?: string, tsCompilerOptions: TSCompilerOptions) => string`

compile content in `filepath` to javascript, then read it as sandbox

* `compileDirectoryTo: (baseDir: string, distDir: string, compileDirToOpts: any) => void`

| Param | Type | Required/Default |
| -------- | -------- | -------- |
| baseDir   | string   | Y / -   |
| distDir   | string   | Y / -   |
| compileDirToOpts | [compileDirToOpts] | N / - |

compile files in directory `baseDir` recursively to `distDir`, view options in view [compileDirToOpts]

---

### compileDirToOpts

| Field | Type | Required/Default | Explanation |
| -------- | -------- | -------- | --------- |
| compilerOptions   | boolean   | Y / `false`    | typescript's [compilerOptions] |
| fileglobsToCopy | Array, '*' | N / `['*.js', '*.jsc', '*.json']` | whitelist for extensions of globnames to copy when recursive walk to one
| includeLeveledGlobs | string | string[] | N / `['*', '!node_modules', '!.ts']` | glob descriptor list to exclude on walk to every directory level, view detail in [micromatch] |
| filterFileName   | (filename: string): boolean   | N / -    | whether compile File, file would be compiled if returning `true` |

<!-- | extsToCopy | Array, '*' | N / `['.js', '.jsc', '.json']` | whitelist for extensions of filename to copy when recursive walk to one file -->
**notice** `compileDirToOpts.extsToCopy` is depreacated, if you pass it,`compileDirToOpts.fileglobsToCopy` get invalid.

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
fib-typify src -o lib -c .typify.json
```

Command above means compiling directory `src` to directory `lib` with configuration file `.typify.json`. The default tsCompilerOptions is
```javascript
{
    target: 'es6',
    module: 'commonjs'
}
```
if you want to extend it, just write .json/.js/.jsc file, and put its path relateive to `cwd()` after `-c`/`--config-file` CLI option.

I only provided one simple and crude error exception mechanism, so in some cases it may be not friendly as you like, it's welcome to take PR to help optimizting this part of `fib-typify` :)


## TODO

- [x] <del>There is no official `*.d.ts` for fibjs yet. I will support generating `fibjs.d.ts` when compilation.</del>  ---> Just use [fib-types](https://github.com/fibjs/fib-types)
- [ ] better options for `compileDirectoryTo`
    - [ ] hooks before, when, after compiling
    - [ ] on walk to one file recursively
    - [ ] customizable `recursive`
    - [ ] support `fileglobsToCopy` with higher priorty than `extsToCopy`
- [ ] compile '.ts' to '.jsc' directly
- [ ] pack compiled '.jsc' to binary and extract one zipped file.
- [ ] `--help` CLI option for cli
## Contributions

If you wanna contribute to this package, just learn about [fibjs] first, then fork this repo :)

[typescript]:https://github.com/Microsoft/TypeScript
[fibjs]:http://fibjs.org/
[jstransformer-typescript]:https://github.com/jstransformers/jstransformer-typescript
[jstransformer]:https://github.com/jstransformers/jstransformer

[compilerOptions]:https://www.typescriptlang.org/docs/handbook/compiler-options.html
[compileDirToOpts]:#compileDirToOpts
[micromatch]:https://github.com/micromatch/micromatch#options
