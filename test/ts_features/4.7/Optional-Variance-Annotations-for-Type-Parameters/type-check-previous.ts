type Foo<T> = {
    x: T;
    f: Bar<T>;
}
type Bar<U> = (x: Baz<U[]>) => void;
type Baz<V> = {
    value: Foo<V[]>;
}
declare let foo1: Foo<unknown>;
declare let foo2: Foo<string>;
foo1 = foo2;  // Should be an error but isn't ❌
foo2 = foo1;  // Error - correct ✅
