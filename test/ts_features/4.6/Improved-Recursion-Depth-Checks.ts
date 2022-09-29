interface Foo<T> {
    prop: T;
}
declare let x: Foo<Foo<Foo<Foo<Foo<Foo<string>>>>>>;
declare let y: Foo<Foo<Foo<Foo<Foo<string>>>>>;
x = y;
