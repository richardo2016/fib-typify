declare function doSomeStuff(): void;

/**
 * TypeScript 4.6 is now much more lenient in that check and permits other code to run before super()., all while still ensuring that super() occurs at the top-level before any references to this.
 */
class Base {
    // ...
}
class Derived extends Base {
    someProperty = true;
    constructor() {
        doSomeStuff();
        super();
    }
}
