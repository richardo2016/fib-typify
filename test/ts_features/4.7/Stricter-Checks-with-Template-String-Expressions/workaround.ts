function logKey<S extends string | symbol>(key: S): S {
    // Now an error.
    console.log(`${String(key)} is the key`);
    return key;
}

function get<T, K extends string & keyof T>(obj: T, key: K) {
    // Now an error.
    console.log(`Grabbing property '${key}'.`);
    return obj[key];
}
