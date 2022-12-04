const test = require('test');
test.setup();

const path = require('path');
const coroutine = require('coroutine');

const Typify = require('..')
const fibjsVersion = require('util').buildInfo().fibjs

describe.only('error emitted by fib-typify correctly', () => {
    function run_test(vbox) {
        ;[
            // [
            //     `normal error emitted in top level`,
            //     './source-map/normal.ts',
            //     6, 7,
            //     '123',
            // ],
            // [
            //     `error missing in coroutine.js(but it would be output)`,
            //     './source-map/coroutine.js',
            //     false
            // ],
            [
                `error missing in coroutine-by-arg.ts(but it would be output)`,
                './source-map/coroutine-by-arg.ts',
                false
            ],
            // [
            //     `error missing in coroutine.ts(but it would be output)`,
            //     './source-map/coroutine.ts',
            //     false
            // ],
            // [
            //     `error emitted in set-timeout(but it would be output)`,
            //     './source-map/set-timeout.ts',
            //     false
            // ],
            // [
            //     `error emitted in set-timeout.js(but it would be output)`,
            //     './source-map/set-timeout.js',
            //     false
            // ]
        ].forEach(([
            purpose,
            require_path,
            lineNumber, columnNumber,
            message,
        ]) => {
            if (fibjsVersion < '0.26.0')
                return

            const target_path = path.resolve(__dirname, require_path)

            function test_item () {
                let e = null
                try {
                    coroutine.sleep(0);
                    const mod = vbox.require(require_path, __dirname);
                    fiber = mod.fiber
                    // console.notice('[feat] fiber', fiber);
                    if (fiber) {
                        fiber.join();
                    }
                } catch (err) {
                    e = err
                } finally {
                    if (!lineNumber) {
                        assert.equal(e, null)
                        return
                    } else if (!e) {
                        throw new Error(`error expected but not found`)
                    } else {
                        // leave here for debugging
                        // console.error(e)
                    }

                    assert.equal(e.message, message)

                    // correct lineNumber/columnNumber only suppported in fibjs >= 0.26.x
                    assert.isTrue(e.stack.includes(
                        target_path
                    ))

                    console.notice(`test lineNumber and columnNumber on stack:`)
                    console.notice(e.stack)

                    assert.isTrue(e.stack.includes(
                        `at ${target_path}:${lineNumber}:${columnNumber}`
                    ))

                    const stacks = e.stack.split('\n    at').slice(1)

                    assert.equal(stacks.findIndex(x => x.includes(
                        `${target_path}:${lineNumber}:${columnNumber}`
                    )), 0)
                }
            }

            it(purpose, () => {
                test_item()
            })
        })
    }

    describe('by top-level api generateLoaderbox', () => {
        const vbox = Typify.generateLoaderbox({
            inlineSourceMap: true
        })
        run_test(vbox)
    })

    describe.skip('by top-level ChainLoader.loader(...).sandbox()', () => {
        // would emit correct stack lineNumber/columnNumber info in sync,
        run_test(
            Typify.loader({
                compilerOptions: {
                    inlineSourceMap: true
                }
            }).sandbox()
        )
    })

    describe.skip('by top-level ChainLoader.loader().sandbox()', () => {
        // would emit wrong stack lineNumber/columnNumber info
        run_test(
            Typify.loader().sandbox()
        )
    })
})

require.main === module && test.run(console.DEBUG)
