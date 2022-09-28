/// <reference lib="es2015" />

// A = string
type A = Awaited<Promise<string>>;
// B = number
type B = Awaited<Promise<Promise<number>>>;
// C = boolean | number
type C = Awaited<boolean | Promise<number>>;

/**
 * The Awaited type can be helpful for modeling existing APIs, including JavaScript built-ins like
 * Promise.all, Promise.race, etc. In fact, some of the problems around inference with Promise.all
 * served as motivations for Awaited. Here’s an example that fails in TypeScript 4.4 and earlier.
 */
declare function MaybePromise<T>(value: T): T | Promise<T> | PromiseLike<T>;
async function doSomething(): Promise<[number, number]> {
  const result = await Promise.all([MaybePromise(100), MaybePromise(200)]);
  // Error!
  //
  //    [number | Promise<100>, number | Promise<200>]
  //
  // is not assignable to type
  //
  //    [number, number]
  return result;
}
