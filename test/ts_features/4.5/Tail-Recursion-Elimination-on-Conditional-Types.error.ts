type InfiniteBox<T> = { item: InfiniteBox<T> };
type Unpack<T> = T extends { item: infer U } ? Unpack<U> : T;
// error: Type instantiation is excessively deep and possibly infinite.
type Test = Unpack<InfiniteBox<number>>;
