const CORE = require('./core')

exports.compileModule = function (tsRaw = '', options) {
    return CORE._getModuleTransplor(options)(tsRaw)
}
