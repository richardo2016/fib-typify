const coroutine = require('coroutine')

coroutine.start(() => {
    throw new Error("I am from coroutine");
})

