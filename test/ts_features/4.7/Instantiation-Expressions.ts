/// <reference lib="es2015" />

interface Box<T> {
    value: T;
}
function makeBox<T>(value: T) {
    return { value };
}

interface Hammer {};
interface Wrench {};

const makeHammerBox = makeBox<Hammer>;
const makeWrenchBox = makeBox<Wrench>;

// This logic also works for constructor functions such as Array, Map, and Set.

// Has type `new () => Map<string, Error>`
const ErrorMap = Map<string, Error>;
// Has type `// Map<string, Error>`
const errorMap = new ErrorMap();
