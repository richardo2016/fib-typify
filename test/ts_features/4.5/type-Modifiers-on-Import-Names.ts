import { Dog, type Animal } from "./animal";

export class Cat implements Animal {
    isDangerous() {
        return false;
    }

    someMethod() {
    }
}
