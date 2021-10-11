/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
 */
type BatmanWatchCount = {
    "Batman Begins": number | undefined;
    "The Dark Knight": number | undefined;
    "The Dark Knight Rises": number | undefined;
};

const batmanWatchCount: BatmanWatchCount = {
    "Batman Begins": undefined,
    "The Dark Knight": undefined,
    "The Dark Knight Rises": undefined,
};

// Still an error in TypeScript 4.2.
const movieWatchCount: { [key: string]: number } = batmanWatchCount;

// Still an error in TypeScript 4.2.
// Index signatures don't implicitly allow explicit `undefined`.
movieWatchCount["It's the Great Pumpkin, Charlie Brown"] = undefined;
