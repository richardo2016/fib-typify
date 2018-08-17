const util = require('util')

const ver = util.buildInfo().fibjs

exports.default = ver
exports.suffix = ver < '0.25.0' ? '.ts' : ''
