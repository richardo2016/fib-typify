// see node_modules/typescript/lib/lib.es5.d.ts
// type NonNullable<T> = T & {};

function foo<T>(x: NonNullable<T>, y: NonNullable<NonNullable<T>>) {
    x = y; // always worked
    y = x; // used to error, now works
}
