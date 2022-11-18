// with --strictNullChecks

function bar(value: {}) {
    Object.keys(value); // This call throws on null/undefined at runtime.
}
function foo<T extends {}>(x: T) {
    bar(x); // Used to be allowed, now is an error in 4.8.
}
foo({});
