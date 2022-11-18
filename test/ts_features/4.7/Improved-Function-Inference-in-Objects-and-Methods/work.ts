// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods

declare function f<T>(arg: {
    produce: (n: string) => T,
    consume: (x: T) => void }
): void;
// Works
f({
    produce: () => "hello",
    consume: x => x.toLowerCase()
});
// Works
f({
    produce: (n: string) => n,
    consume: x => x.toLowerCase(),
});
// Was an error, now works.
f({
    produce: n => n,
    consume: x => x.toLowerCase(),
});
// Was an error, now works.
f({
    produce: function () { return "hello"; },
    consume: x => x.toLowerCase(),
});
// Was an error, now works.
f({
    produce() { return "hello" },
    consume: x => x.toLowerCase(),
});
