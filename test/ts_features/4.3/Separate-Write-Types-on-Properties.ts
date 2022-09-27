/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html
 */
import { expectType } from 'ts-expect'

class Thing {
    #size = 0;

    get size(): number {
        return this.#size;
    }
    set size(value: string | number | boolean) {
        let num = Number(value);

        // Don't allow NaN and stuff.
        if (!Number.isFinite(num)) {
            this.#size = 0;
            return;
        }

        this.#size = num;
    }
}

var thing = new Thing();
expectType<number>(thing.size)
expectType<number>(thing.size = 5)
expectType<boolean>(thing.size = true)
expectType<string>(thing.size = '5')
