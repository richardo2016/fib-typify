const version = require('./_version').default
const suffix = require('./_version').suffix

export const basic = require('./basic' + suffix)

if (version >= '0.25.0') {
    require('./interface')
}
