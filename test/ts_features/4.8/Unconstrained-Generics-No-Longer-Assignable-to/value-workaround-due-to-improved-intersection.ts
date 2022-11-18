function bar(value: {}) {
    Object.keys(value); // This call throws on null/undefined at runtime.
}

function foo<T>(x: T) {
    bar(x!);
}
foo({});
