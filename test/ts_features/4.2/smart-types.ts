/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
 */
import { expectType } from 'ts-expect'

export type BasicPrimitive = number | string | boolean;

// Hover on 'doStuff' below to see what TypeScript displays for the return type.
// We might have expected it to print as
//
//   BasicPrimitive | undefined
//
// but below TypeScript 4.2, it instead displays as
//
//   number | string | boolean | undefined
//
export function doStuff(value: BasicPrimitive) {
    if (Math.random() < 0.5) {
        return undefined;
    }

    return value;
}

expectType<BasicPrimitive>(doStuff(1));
expectType<BasicPrimitive>(doStuff("1"));
expectType<BasicPrimitive>(doStuff(false));
