// with --strictNullChecks

// Accepts any non-null non-undefined value
function bar(value: {}) {
    Object.keys(value); // This call throws on null/undefined at runtime.
}
// Unconstrained type parameter T...
function foo<T>(x: T) {
    bar(x); // Used to be allowed, now is an error in 4.8.
    //  ~
    // error: Argument of type 'T' is not assignable to parameter of type '{}'.
}
foo(undefined);
