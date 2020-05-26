const coroutine = require('coroutine')

123123
456457
789879

123123
1 & 0;
'a' && 0;

exports.fiber = coroutine.start(() => {
    coroutine.sleep(100);




    throw new Error("I am from coroutine.js");
})
