type FirstIfString<T> =
    T extends [infer S extends string, ...unknown[]]
        ? S
        : never;

 // string
 type A = FirstIfString<[string, number, number]>;
 // "hello"
 type B = FirstIfString<["hello", number, number]>;
 // "hello" | "world"
 type C = FirstIfString<["hello" | "world", boolean]>;
 // never
 type D = FirstIfString<[boolean, number, string]>;
