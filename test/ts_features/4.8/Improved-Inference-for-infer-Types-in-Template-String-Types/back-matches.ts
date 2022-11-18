import { expectType } from 'ts-expect';

// JustNumber is `number` here because TypeScript parses out `"1.0"`, but `String(Number("1.0"))` is `"1"` and doesn't match.
type JustNumber = "1.0" extends `${infer T extends number}` ? T : never;

declare const jn: JustNumber;
expectType<number>(jn);
