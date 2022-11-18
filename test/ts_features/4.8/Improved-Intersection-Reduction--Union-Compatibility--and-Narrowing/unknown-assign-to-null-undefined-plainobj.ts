function f(x: unknown, y: {} | null | undefined) {
    x = y; // always worked
    y = x; // used to error, now works
}
