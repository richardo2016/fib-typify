type FirstIfString<T> =
    T extends [infer S, ...unknown[]]
        ? S extends string ? S : never
        : never;
 // string
type A = FirstIfString<[string, number, number]>;
// "hello"
type B = FirstIfString<["hello", number, number]>;
// "hello" | "world"
type C = FirstIfString<["hello" | "world", boolean]>;
// never
type D = FirstIfString<[boolean, number, string]>;
