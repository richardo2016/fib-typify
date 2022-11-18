interface Foo<T> {
    x: Bar<T>;
}

interface Bar<T extends {}> { }
