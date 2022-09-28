abstract class C1 {
    abstract prop: number;
}

abstract class C2 {
    abstract prop = 1;
    //       ~~~~
    // Property 'prop' cannot have an initializer because it is marked abstract.
}
