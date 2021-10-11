/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
 */
type WesAndersonWatchCount = {
    "Fantastic Mr. Fox"?: number;
    "The Royal Tenenbaums"?: number;
    "Moonrise Kingdom"?: number;
    "The Grand Budapest Hotel"?: number;
};

const wesAndersonWatchCount: WesAndersonWatchCount = {};
const movieWatchCount: { [key: string]: number } = wesAndersonWatchCount;
