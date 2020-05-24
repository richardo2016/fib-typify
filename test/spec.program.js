const test = require('test');
test.setup();

describe('TS Program API', () => {
    require('./programs-compile-single-entry/spec');
    require('./programs-ftsc/spec');
})

require.main === module && test.run(console.DEBUG);