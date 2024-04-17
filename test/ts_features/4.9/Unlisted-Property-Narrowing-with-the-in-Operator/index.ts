interface Context {
    packageJSON: unknown;
}
function tryGetPackageName(context: Context): string | undefined {
    const packageJSON = context.packageJSON;
    // Check to see if we have an object.
    if (packageJSON && typeof packageJSON === "object") {
        // Check to see if it has a string name property.
        if ("name" in packageJSON && typeof packageJSON.name === "string") {
            // Just works!
            return packageJSON.name;
        }
    }
    return undefined;
}
