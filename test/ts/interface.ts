interface foo {
    foo1: string;
    bar: number;
    bar1: number;
}

export function doFoo (_foo: foo) {
    return _foo.foo1 + _foo.bar + _foo.bar1
}
