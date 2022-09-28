/// <reference lib="es2015" />

async function foo(): Promise<boolean> {
    return false;
}
async function bar(): Promise<string> {
    const fooResult = foo();
    if (fooResult) {
        // <- error! :D
        return "true";
    }
    return "false";
}
