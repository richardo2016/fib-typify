function foo1(arg: unknown) {
    if (typeof arg === "string") {
        console.log(arg.toUpperCase());
    }
}

// In TS 4.3 and below
function foo2(arg: unknown) {
    const argIsString = typeof arg === "string";
    if (argIsString) {
        console.log(arg.toUpperCase());
        //              ~~~~~~~~~~~
        // Error! Property 'toUpperCase' does not exist on type 'unknown'.
    }
}

type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "square"; sideLength: number };

function area1(shape: Shape): number {
    const isCircle = shape.kind === "circle";
    if (isCircle) {
        // We know we have a circle here!
        return Math.PI * shape.radius ** 2;
    } else {
        // We know we're left with a square here!
        return shape.sideLength ** 2;
    }
}

function area2(shape: Shape): number {
    // Extract out the 'kind' field first.
    const { kind } = shape;

    if (kind === "circle") {
        // We know we have a circle here!
        return Math.PI * shape.radius ** 2;
    } else {
        // We know we're left with a square here!
        return shape.sideLength ** 2;
    }
}

function doSomeChecks(
    inputA: string | undefined,
    inputB: string | undefined,
    shouldDoExtraWork: boolean
) {
    const mustDoWork = inputA && inputB && shouldDoExtraWork;
    if (mustDoWork) {
        // We can access 'string' properties on both 'inputA' and 'inputB'!
        const upperA = inputA.toUpperCase();
        const upperB = inputB.toUpperCase();
        // ...
    }
}

// Note that there’s a cutoff - TypeScript doesn’t go arbitrarily deep when checking these conditions, but its analysis is deep enough for most checks.
function f(x: string | number | boolean) {
    const isString = typeof x === "string";
    const isNumber = typeof x === "number";
    const isStringOrNumber = isString || isNumber;
    if (isStringOrNumber) {
        x;
        //   (parameter) x: string | number
    } else {
        x;
        //   (parameter) x: boolean
    }
}
