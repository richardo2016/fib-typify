type Func = (...args: ["a", number] | ["b", string]) => void;
const f1: Func = (kind, payload) => {
    if (kind === "a") {
        payload.toFixed(); // 'payload' narrowed to 'number'
    }
    if (kind === "b") {
        payload.toUpperCase(); // 'payload' narrowed to 'string'
    }
};
f1("a", 42);
f1("b", "hello");
