// ----------------------------------------------------------------------------
abstract class C {
    constructor(a: string, b: number) {
        // ...
    }
}
// Has the type '[a: string, b: number]'.
type CParams = ConstructorParameters<typeof C>;

// ----------------------------------------------------------------------------
// type MyConstructorOf<T> = {
//     abstract new(...args: any[]): T;
// }
// or using the shorthand syntax:
type MyConstructorOf<T> = abstract new (...args: any[]) => T;
