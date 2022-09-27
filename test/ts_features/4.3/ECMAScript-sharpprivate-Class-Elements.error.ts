// -----------------------------------
class Foo {
    #someMethod() {
        //...
    }
    get #someValue() {
        return 100;
    }
    publicMethod() {
        // These work.
        // We can access private-named members inside this class.
        this.#someMethod();
        return this.#someValue;
    }
}
new Foo().#someMethod();
//        ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.
new Foo().#someValue;
//        ~~~~~~~~~~
// error!
// Property '#someValue' is not accessible
// outside class 'Foo' because it has a private identifier.

// -----------------------------------
class Foo2 {
    static #someMethod() {
        // ...
    }
}
Foo2.#someMethod();
  //  ~~~~~~~~~~~
  // error!
  // Property '#someMethod' is not accessible
  // outside class 'Foo' because it has a private identifier.
