// require --strictNullChecks

async function foo(): Promise<boolean> {
    return false;
}

async function bar(): Promise<string> {
    if (foo()) {
        //  ~~~~~
        // Error!
        // This condition will always return true since
        // this 'Promise<boolean>' appears to always be defined.
        // Did you forget to use 'await'?
        return "true";
    }
    return "false";
}
