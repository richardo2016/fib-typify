// Grabs the first element of a tuple if it's assignable to 'number',
// and returns 'never' if it can't find one.
type TryGetNumberIfFirst<T> =
    T extends [infer U extends number, ...unknown[]] ? U : never;

// feature above introduced in 4.7
// code below is improved in 4.8

// SomeNum used to be 'number'; now it's '100'.
type SomeNum = "100" extends `${infer U extends number}` ? U : never;
// SomeBigInt used to be 'bigint'; now it's '100n'.
type SomeBigInt = "100" extends `${infer U extends bigint}` ? U : never;
// SomeBool used to be 'boolean'; now it's 'true'.
type SomeBool = "true" extends `${infer U extends boolean}` ? U : never;
