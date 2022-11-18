import * as foo from "./foo.cjs";

// prints "hello world!"
foo.helper();

import { helper } from "./foo.cjs";
// prints "hello world!"
helper();
