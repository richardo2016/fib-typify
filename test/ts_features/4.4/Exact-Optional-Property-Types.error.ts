// require flag: --exactOptionalPropertyTypes
interface Person {
    name: string;
    age?: number;
}

// With 'exactOptionalPropertyTypes' on:
const p: Person = {
    // Type '{ name: string; age: undefined; }' is not assignable to type 'Person' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.
    //   Types of property 'age' are incompatible.
    //     Type 'undefined' is not assignable to type 'number'.
    name: "Daniel",
    age: undefined, // Error! undefined isn't a number
};
