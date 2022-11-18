import { expectType } from 'ts-expect';

declare function chooseRandomly<T>(x: T, y: T): T;
let [a, b, c] = chooseRandomly([42, true, "hi!"], [0, false, "bye!"]);
//   ^  ^  ^
//   |  |  |
//   |  |  string
//   |  |
//   |  boolean
//   |
//   number

expectType<number>(a);
expectType<boolean>(b);
expectType<string>(c);
