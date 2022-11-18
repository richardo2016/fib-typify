function narrowUnknownishUnion(x: {} | null | undefined) {
    if (x) {
        x;  // {}
    }
    else {
        x;  // {} | null | undefined
    }
}

/**
 * unknown is now narrowed just like {} | null | undefined in truthy branches.
 */
function narrowUnknown(x: unknown) {
    if (x) {
        x;  // used to be 'unknown', now '{}'
    }
    else {
        x;  // unknown
    }
}
