declare function someCondition(): boolean;

class Foo {
    static count = 0;

    // This is a static block:
    static {
        if (someCondition()) {
            Foo.count++;
        }
    }
}

/**
 * These static blocks allow you to write a sequence of statements with their own scope that can access private fields within the containing class. That means that we can write initialization code with all the capabilities of writing statements, no leakage of variables, and full access to our class’s internals.
 */

declare function loadLastInstances(): any;

class Foo2 {
    static #count = 0;

    get count() {
        return Foo2.#count;
    }

    static {
        try {
            const lastInstances = loadLastInstances();
            Foo2.#count += lastInstances.length;
        }
        catch {}
    }
}

/**
 * Note that a class can have multiple static blocks, and they’re run in the same order in which they’re written.
 */

// Prints:
//    1
//    2
//    3
class Foo3 {
    static prop = 1
    static {
        console.log(Foo3.prop++);
    }
    static {
        console.log(Foo3.prop++);
    }
    static {
        console.log(Foo3.prop++);
    }
}
