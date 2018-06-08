# fib-typify

[![Build Status](https://travis-ci.com/richardo2016/fib-typify.svg?branch=master)](https://travis-ci.org/richardo2016/fib-typify)
[![NPM version](https://img.shields.io/npm/v/fib-typify.svg)](https://www.npmjs.org/package/fib-typify)

just write fibjs with typescript : )

## Introduction
`fib-typify` allows you write fibjs with [typescript] in compilation or in runtime. It depends on original [typescript] stable version. As typescript is written with **nodejs**, it's not restricted in nodejs runtime: you can also compile typescript in browser or _ANY_ other pure Javascript runtime. That is, you can use it in fibjs also.

## renderer
`fib-typify`'s core is [jstransformer-typescript] (which is one [jstransformer] aimed to typescript) like, but this core is only valid in fibjs rather than pure javascript

## APIs

**void: renderDirectory(baseDir: string, opts: Options)**

| Param | Type | Required/Default |
| -------- | -------- | -------- |
| baseDir   | string   | Y / `path.resolve(__dirname, './')`   |

**Options**

| Field | Type | Required/Default | Explanation |
| -------- | -------- | -------- | --------- |
| recursive   | boolean   | Y / `false`    | whether render recursively |

## TODO

- [x] <del>There is no official `*.d.ts` for fibjs yet. I will support generating `fibjs.d.ts` when compilation.</del> Just use [fib-types](https://github.com/fibjs/fib-types)

## Contributions

If you wanna contribute to this package, just learn about [fibjs] first, then fork this repo :)

[typescript]:https://github.com/Microsoft/TypeScript
[fibjs]:http://fibjs.org/
[jstransformer-typescript]:https://github.com/jstransformers/jstransformer-typescript
[jstransformer]:https://github.com/jstransformers/jstransformer
