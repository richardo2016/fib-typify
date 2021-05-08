interface Person {
    name: string;
    age: number;
    location: string;
}
interface Animal {
    name: string;
    owner: Person;
}

function copyOwner1(pet?: Animal) {
    return {
        ...(pet && pet.owner),
        otherStuff: 123,
    };
}
// We could also use optional chaining here:
function copyOwner2(pet?: Animal) {
    return {
        ...pet?.owner,
        otherStuff: 123,
    };
}
