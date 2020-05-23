const { getModuleTranspilor } = require('../ts-apis/transpilor')

exports.compileModule = function (tsRaw = '', options) {
    return getModuleTranspilor(options)(tsRaw)
}
