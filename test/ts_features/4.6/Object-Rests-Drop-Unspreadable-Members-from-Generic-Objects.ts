class Thing {
    someProperty = 42;
    someMethod() {
        // ...
    }
}
function foo<T extends Thing>(x: T) {
    let { someProperty, ...rest } = x;
    // Used to work, is now an error!
    // Property 'someMethod' does not exist on type 'Omit<T, "someProperty" | "someMethod">'.
    rest.someMethod();
}

class Thing2 {
    someProperty = 42;
    someMethod2() {
        // ...
    }
    someOtherMethod() {
        let { someProperty, ...rest } = this;
        // Used to work, is now an error!
        // Property 'someMethod2' does not exist on type 'Omit<T, "someProperty" | "someMethod">'.
        rest.someMethod2();
    }
}
