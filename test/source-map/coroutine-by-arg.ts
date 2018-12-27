const coroutine = require('coroutine')

123123
456457
789879

123123
1 & 0;
'a' && 0;

export const fiber = coroutine.start((Error) => {


    coroutine.sleep(100);








    throw new Error("I am from coroutine.ts");
}, Error)
