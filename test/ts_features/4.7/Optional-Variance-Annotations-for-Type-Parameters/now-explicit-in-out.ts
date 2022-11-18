interface Animal {
    animalStuff: any;
}
interface Dog extends Animal {
    dogStuff: any;
}

type Getter<out T> = () => T;
type Setter<in T> = (value: T) => void;

declare const setAnimal: Setter<Animal>;
declare const setDog: Setter<Dog>;
declare const getDog: Getter<Dog>;

const dog = getDog();
setDog(dog);
setAnimal(dog);

const animal = getDog();
setAnimal(animal);
