## Structures

1. [ ] migrate classical APIs about transpilation/runtime to src/*, rewrite them as '*.ts'

## Test Cases

1. [ ] error emitted in simple case
    1. [ ] error from script required
    1. [ ] error from unexpected callback
    1. [ ] error from unexpected fiber
        1. [x] `coroutine.start`
        1. [ ] `coroutine.parallel`
        1. [ ] `util.sync`
        1. [x] setTimeout
        1. [ ] setImmediate
        1. [ ] setInterval
    1. [ ] error from unexpected Promise
1. [ ] error emitted in complex case
    1. [ ] `mixin` 1.1 + 1.2
    1. [ ] `mixin` 1.1 + 1.3.1
    1. [ ] `mixin` 1.1 + 1.3.2
    1. [ ] `mixin` 1.1 + 1.3.3
    1. [ ] `mixin` 1.1 + 1.4

## Features

- [x] <del>There is no official `*.d.ts` for fibjs yet. I will support generating `fibjs.d.ts` when compilation.</del>  Now Just use [fib-types](https://github.com/fibjs/fib-types)
- [ ] better options for `compileDirectoryTo`
    - [ ] hooks before, when, after compiling
    - [ ] on walk to one file recursively
    - [ ] customizable `recursive`
    - [ ] support `fileglobsToCopy` with higher priorty than `extsToCopy`
- [ ] compile `.ts` to '.jsc' directly
- [ ] pack compiled '.jsc' to binary and extract one zipped file.
- [ ] `--help` CLI option for cli
