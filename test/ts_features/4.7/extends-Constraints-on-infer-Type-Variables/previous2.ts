type FirstIfString<T> =
    T extends [string, ...unknown[]]
        // Grab the first type out of `T`
        ? T[0]
        : never;

 // string
type A = FirstIfString<[string, number, number]>;
// "hello"
type B = FirstIfString<["hello", number, number]>;
// "hello" | "world"
type C = FirstIfString<["hello" | "world", boolean]>;
// never
type D = FirstIfString<[boolean, number, string]>;
