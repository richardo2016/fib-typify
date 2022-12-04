const coroutine = require('coroutine');

const foo = 'bar'

function throw_error () {
    coroutine.start(() => {
        throw new Error('I am one async error');
    });

    throw new Error('I am one bloking error');
}

let err
try {
    throw_error();
} catch (e) {
    err = e;
}

if (err) {
    console.log(`catched error:`, err.message);
} else {
    console.log(`no catched error`);
}
