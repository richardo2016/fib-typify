const test = require('test');
test.setup();

const coroutine = require('coroutine')

const fibTypify = require('../')
const version = fibTypify.loaderBox.require('./ts_files/_version', __dirname).default
const fullSupportLoaderBox = version >= '0.25.0'

describe('loader', () => {
    function assertBasicModule(rawModule) {
        assert.isObject(rawModule)
        assert.isFunction(rawModule.add)
        assert.isFunction(rawModule.http)
        assert.equal(rawModule.http(), 'http')
        assert.isFunction(rawModule.add)
        assert.equal(rawModule.add(1, 2), 3)

        assert.isFunction(rawModule.hello)
        assert.isFunction(rawModule.hello)
        assert.equal(rawModule.hello(), 'hello, world')
    }

    function assertClassModule(classModule) {
        assert.isObject(classModule)
        assert.property(classModule, 'default')
        assert.property(classModule.default, 'bar')
        assert.property(classModule.default, 'bar2')

        const instance = new classModule.default()

        assert.isFunction(instance.foo1)
        assert.isFunction(instance.foo2)
    }

    it('basic require', () => {
        assert.isObject(fibTypify.loaderBox)

        const mod = fibTypify.loaderBox.require('./ts_files/basic', __dirname)
        assertBasicModule(mod)

        const mod2 = fibTypify.loaderBox.require('./ts_files/basic.ts', __dirname)
        assertBasicModule(mod2)

        assert.deepEqual(
            Object.keys(mod),
            Object.keys(mod2)
        )

        const cmod = fibTypify.loaderBox.require('./ts_files/class_require', __dirname)
        assertClassModule(cmod)

        if (fullSupportLoaderBox) {
            const cmod = fibTypify.loaderBox.require('./ts_files/class_import', __dirname)
            assertClassModule(cmod)
        }
    })

    it('increasing/parallel sandbox', () => {
        const iterbase = Array(5).fill(undefined);

        function testBody() {
            const module = fibTypify.loaderBox.require('./ts_files/_4_sandbox', __dirname);

            assert.isObject(module);
            assert.isObject(module.basic);
            assert.isFunction(module.basic.add);
        }

        iterbase.forEach(() => testBody());
        coroutine.parallel(iterbase, () => testBody());
    })

    it('wrong syntax', () => {
        assert.throws(() => {
            require('./ts_files/wrong_syntax1.1');
        })
        assert.throws(() => {
            require('./ts_files/wrong_syntax1.2');
        })
        assert.throws(() => {
            require('./ts_files/wrong_syntax1.3');
        })
        assert.throws(() => {
            require('./ts_files/wrong_syntax1.4');
        })
        const badPractice = fibTypify.loaderBox.require('./ts_files/bad_practice2', __dirname);
        assert.isFunction(badPractice.add)
        assert.property(badPractice, '__esModule')
        // assert.equal(Object.keys(badPractice).length, 2)
        assert.equal(badPractice.add(), 'psudo add')
    })

    it('loop require', () => {
        if (!fullSupportLoaderBox) {
            const loop1 = fibTypify.loaderBox.require('./ts_files/loop_require/loop1', __dirname)
            assert.equal(loop1.I, 'loop1')

            const loop2 = fibTypify.loaderBox.require('./ts_files/loop_require/loop2', __dirname)
            assert.equal(loop2.I, 'loop2')
            return
        }

        const loop1 = fibTypify.loaderBox.require('./ts_files/loop_import/loop1', __dirname)
        assert.equal(loop1.I, 'loop1')

        const loop2 = fibTypify.loaderBox.require('./ts_files/loop_import/loop2', __dirname)
        assert.equal(loop2.I, 'loop2')
    })
})

require.main === module && test.run(console.DEBUG)
