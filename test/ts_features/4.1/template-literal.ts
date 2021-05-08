/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html
 */

type TL = `//${string}:${number}`

function func (input: TL) {}

func('//abc:123')
