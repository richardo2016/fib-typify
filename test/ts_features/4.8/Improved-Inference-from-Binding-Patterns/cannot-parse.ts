import { expectType } from 'ts-expect';

declare function f<T>(x?: T): T;
let [x, y, z] = f();

expectType<any>(x);
expectType<any>(y);
expectType<any>(z);
