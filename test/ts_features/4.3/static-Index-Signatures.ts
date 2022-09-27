class Foo {
    static hello = "hello";
    static world = 1234;
    static [propName: string]: string | number | undefined;
}
// Valid.
Foo["whatever"] = 42;
// Has type 'string | number | undefined'
let x = Foo["something"];
