const argFlags = require('./arg_flags')

module.exports = {
    'noArg:output': `outputDir from ${argFlags.output.join(',')} is required`
}
