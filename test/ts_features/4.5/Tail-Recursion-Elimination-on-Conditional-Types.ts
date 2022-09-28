type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;
// Test = "hello" | "world"
type Test = TrimLeft<"   hello" | " world">;

type TrimLeft1<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft1<Rest> : T;
// error: Type instantiation is excessively deep and possibly infinite.
type Test1 = TrimLeft<"                                                oops">;

/**
 * Keep in mind, the following type won’t be optimized, since it uses the result of a conditional type by adding it to a union.
 */
type GetChars<S> =
    S extends `${infer Char}${infer Rest}` ? Char | GetChars<Rest> : never;

/**
 * If you would like to make it tail-recursive, you can introduce a helper that takes an “accumulator” type parameter, just like with tail-recursive functions.
 *
 */
type GetChars1<S> = GetCharsHelper<S, never>;
type GetCharsHelper<S, Acc> =
    S extends `${infer Char}${infer Rest}` ? GetCharsHelper<Rest, Char | Acc> : Acc;
