/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html
 */

type Options = {
    [K in "noImplicitAny" | "strictNullChecks" | "strictFunctionTypes"]?: boolean;
};

const ops: Options = {
    noImplicitAny: true
}

type _Partial<T> = {
    [K in keyof T]?: T[K];
};

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;

const host1: LazyPerson = {
    getName () { return '' },
    getAge () { return 1 },
    getLocation () { return '' },
}

type RemoveKindField<T> = {
    [K in keyof T as Exclude<K, "kind">]: T[K]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

const host2: KindlessCircle = {
    radius: 2
}
