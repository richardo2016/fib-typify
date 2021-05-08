type ElementType<T> = T extends ReadonlyArray<infer U> ? ElementType<U> : T;
function deepFlatten<T extends readonly unknown[]>(x: T): ElementType<T>[] {
    // throw "not implemented";
    return null as any;
}
// All of these return the type 'number[]':
deepFlatten([1, 2, 3]);
deepFlatten([[1], [2, 3]]);
deepFlatten([[1], [[2]], [[[3]]]]);

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
/// Like `promise.then(...)`, but more accurate in types.
declare function customThen<T, U>(
    p: Promise<T>,
    onFulfilled: (value: Awaited<T>) => U
): Promise<Awaited<U>>;
