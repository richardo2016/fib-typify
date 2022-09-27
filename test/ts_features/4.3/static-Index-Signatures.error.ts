class Foo {
    static prop = true;
    //     ~~~~
    // Error! Property 'prop' of type 'boolean'
    // is not assignable to string index type
    // 'string | number | undefined'.
    static [propName: string]: string | number | undefined;
}
