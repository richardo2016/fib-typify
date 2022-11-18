/// <reference lib="es2015" />

const key = Symbol();
const numberOrString = Math.random() < 0.5 ? 42 : "hello";
const obj = {
    [key]: numberOrString,
};
if (typeof obj[key] === "string") {
    let str = obj[key].toUpperCase();
}
