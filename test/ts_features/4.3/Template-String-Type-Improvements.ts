type Color = "red" | "blue";
type Quantity = "one" | "two";
type SeussFish = `${Quantity | Color} fish`;

// ------------------
let s1: `${number}-${number}-${number}`;
let s2: `1-2-3` = `1-2-3`;
// Works!
s1 = s2;

function bar(s: string): `hello ${string}` {
    // Previously an error, now works!
    return `hello ${s}`;
}

// ------------------
let s: string = '';
function f<T extends string>(x: T): T { return x; };
// Previously: string
// Now       : `hello ${string}`
let x2 = f(`hello ${s}`);

// ------------------
let s1_1: `${number}-${number}-${number}`;
let s2_1: `1-2-3` = `1-2-3`;
let s3_1: `${number}-2-3` = s2_1;
let s4_1: `1-${number}-3` = s2_1;
let s5_1: `1-2-${number}` = s2_1;
let s6_1: `${number}-2-${number}` = s2_1;
// Now *all of these* work!
s1_1 = s2_1;
s1_1 = s3_1;
s1_1 = s4_1;
s1_1 = s5_1;
s1_1 = s6_1;

// ------------------
function foo<V extends string>(arg: `*${V}*`): V { return arg.slice(1, -1) as V; };
function test<T extends string>(s: string, n: number, b: boolean, t: T) {
    let x1 = foo("*hello*");            // "hello"
    let x2 = foo("**hello**");          // "*hello*"
    let x3 = foo(`*${s}*` as const);    // string
    let x4 = foo(`*${n}*` as const);    // `${number}`
    let x5 = foo(`*${b}*` as const);    // "true" | "false"
    let x6 = foo(`*${t}*` as const);    // `${T}`
    let x7 = foo(`**${s}**` as const);  // `*${string}*`
}
