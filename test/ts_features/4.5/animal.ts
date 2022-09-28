export class Dog implements Animal {
    isDangerous() {
        return false;
    }
}

export interface Animal {
    isDangerous(): boolean;
};
