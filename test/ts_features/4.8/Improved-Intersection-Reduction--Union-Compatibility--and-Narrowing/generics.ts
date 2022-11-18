function throwIfNullable<T>(value: T): NonNullable<T> {
    if (value === undefined || value === null) {
        throw Error("Nullable value!");
    }
    // Used to fail because 'T' was not assignable to 'NonNullable<T>'.
    // Now narrows to 'T & {}' and succeeds because that's just 'NonNullable<T>'.
    return value;
}
