const argFlags = require('./arg_flags')

module.exports = {
    'invalidArg:input': `no valid source directory or entry point provided`,
    'noArg:output': `outputDir from ${argFlags.output.join(',')} is required`,
    'invalidArg:noEntryPoint': `no valid entry point provided`
}
