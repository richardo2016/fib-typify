/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
 */
{
    // A tuple that has either one or two strings.
    let c: [string, string?] = ["hello"];
    c = ["hello", "world"];

    // A labeled tuple that has either one or two strings.
    let d: [first: string, second?: string] = ["hello"];
    d = ["hello", "world"];

    // A tuple with a *rest element* - holds at least 2 strings at the front,
    // and any number of booleans at the back.
    let e: [string, string, ...boolean[]];

    e = ["hello", "world"];
    e = ["hello", "world", false];
    e = ["hello", "world", true, false, true];
}

// before ts 4.2 ↑
// on ts 4.2 ↓
{
    let foo: [...string[], number];

    foo = [123];
    foo = ["hello", 123];
    foo = ["hello!", "hello!", "hello!", 123];

    let bar: [boolean, ...string[], boolean];

    bar = [true, false];
    bar = [true, "some text", false];
    bar = [true, "some", "separated", "text", false];
}

function doStuff(...args: [...names: string[], shouldCapitalize: boolean]): void {};
{
    doStuff(/*shouldCapitalize:*/ false)
    doStuff("fee", "fi", "fo", "fum", /*shouldCapitalize:*/ true);
}
