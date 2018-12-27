const test = require('test');
test.setup();

const path = require('path');
const getErrorSource = require('source-map-support').getErrorSource;

const fibTypify = require('..')

describe('error emitted by fib-typify correctly', () => {
    const vbox = fibTypify.generateLoaderbox()

    ;[
        [
            'normal error emitted in typescript',
            './ts/source-map/normal',
            path.resolve(__dirname, './ts/source-map/normal.ts'),
            '123',
        ]
    ].forEach(([
        purpose,
        require_path,
        target_path,
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
                    `at ${target_path}:6:7`
                ))

                const stacks = e.stack.split('\n    at').slice(1)

                assert.equal(stacks.findIndex(x => x.includes(
                    `${target_path}:6:7`
                )), 0)
            }
        })
    })
})

require.main === module && test.run(console.DEBUG)
