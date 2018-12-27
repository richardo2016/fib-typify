const test = require('test');
test.setup();

const path = require('path');
const getErrorSource = require('source-map-support').getErrorSource;

const fibTypify = require('..')

describe('error emitted by fib-typify correctly', () => {
    const vbox = fibTypify.generateLoaderbox()

    ;[
        [
            `normal error emitted in top level`,
            './ts/source-map/normal',
            path.resolve(__dirname, './ts/source-map/normal.ts'),
            6, 7,
            '123',
        ],
        [
            `error emitted in coroutine(but still it was output)`,
            './ts/source-map/coroutine',
            path.resolve(__dirname, './ts/source-map/coroutine.ts'),
            4, 11,
            'I am from coroutine',
        ],
        [
            `error emitted in set-timeout(but still it was output)`,
            './ts/source-map/set-timeout',
            path.resolve(__dirname, './ts/source-map/set-timeout.ts'),
            4, 11,
            'I am from set-timeout',
        ]
    ].forEach(([
        purpose,
        require_path,
        target_path,
        lineNumber, columnNumber,
        message
    ]) => {
        it(purpose, () => {
            try {
                vbox.require(require_path, __dirname)
            } catch (e) {
                assert.equal(e.message, message)
                assert.isTrue(e.stack.includes(
                    target_path
                ))
                assert.isTrue(e.stack.includes(
                    `at ${target_path}:${lineNumber}:${columnNumber}`
                ))

                const stacks = e.stack.split('\n    at').slice(1)

                assert.equal(stacks.findIndex(x => x.includes(
                    `${target_path}:${lineNumber}:${columnNumber}`
                )), 0)
            }
        })
    })
})

require.main === module && test.run(console.DEBUG)
