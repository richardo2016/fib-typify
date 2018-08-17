const suffix = require('./_version').suffix

const { add, hello } = require('./basic' + suffix)

export default class Foo {
    static bar = 1;

    static bar2 = 'bar';

    foo1(...args) {
        return add(...args)
    }

    foo2() {
        return hello()
    }
}
