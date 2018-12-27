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
