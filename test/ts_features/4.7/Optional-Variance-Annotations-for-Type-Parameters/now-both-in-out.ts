interface State<in out T> {
    get: () => T;
    set: (value: T) => void;
}
