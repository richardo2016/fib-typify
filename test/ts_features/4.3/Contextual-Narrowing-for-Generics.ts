// all errors are expected in typescript 4.2 or earlier, but not in >= 4.3

function makeUnique<T, C extends Set<T> | T[]>(
    collection: C,
    comparer: (x: T, y: T) => number
): C {
    // Early bail-out if we have a Set.
    // We assume the elements are already unique.
    if (collection instanceof Set) {
        return collection;
    }
    // Sort the array, then remove consecutive duplicates.
    collection.sort(comparer);
    //         ~~~~
    // error: Property 'sort' does not exist on type 'C'.
    for (let i = 0; i < collection.length; i++) {
        //                             ~~~~~~
        // error: Property 'length' does not exist on type 'C'.
        let j = i;
        while (
            j < collection.length &&
            comparer(collection[i], collection[j + 1]) === 0
        ) {
            //                    ~~~~~~
            // error: Property 'length' does not exist on type 'C'.
            //                                       ~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~
            // error: Element implicitly has an 'any' type because expression of type 'number'
            //        can't be used to index type 'Set<T> | T[]'.
            j++;
        }
        collection.splice(i + 1, j - i);
        //         ~~~~~~
        // error: Property 'splice' does not exist on type 'C'.
    }
    return collection;
}
