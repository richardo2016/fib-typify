const CORE = require('./core')
const mkdirp = require('@fibjs/mkdirp')

function time () {
    return new Date()
}
const isDebug = exports.isDebug = !!process.env.FIB_DEBUG

exports.mkdirp = (...args) => {
    isDebug && console.log(`${getLogPrefix('io', 'mkdirp')}`)
    return mkdirp(...args)
}

const getLogPrefix = exports.getLogPrefix = (domain = 'default', action = 'action') => {
    return `${CORE.logPrefix}[${domain}:${action}] - [${time()}]  `
}
