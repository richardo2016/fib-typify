interface TypeMap {
    number: number;
    string: string;
    boolean: boolean;
}
type UnionRecord<P extends keyof TypeMap> = {
    [K in P]: {
        kind: K;
        v: TypeMap[K];
        f: (p: TypeMap[K]) => void;
    };
}[P];
function processRecord<K extends keyof TypeMap>(record: UnionRecord<K>) {
    record.f(record.v);
}
// This call used to have issues - now works!
processRecord({
    kind: "string",
    v: "hello!",
    // 'val' used to implicitly have the type 'string | number | boolean',
    // but now is correctly inferred to just 'string'.
    f: (val) => {
        console.log(val.toUpperCase());
    },
});
