/// <reference lib="es2015" />

// 'key' has type 'unique symbol'
const key = Symbol();
class C {
    [key]: string;
    constructor(str: string) {
        // oops, forgot to set 'this[key]'
    }
    screamString() {
        return this[key].toUpperCase();
    }
}
