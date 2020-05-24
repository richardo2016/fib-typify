exports.readSubProcessLine = (sp) => {
    if (typeof sp.readLine === 'function')
        return sp.readLine()

    return sp.stdout.readLine()
}

exports.chDirAndDo = (target, cb) => {
    if (typeof cb !== 'function') return;

    const cwd = process.cwd();

    process.chdir(target);
    let err
    try {
        cb();
    } catch (error) {
        err = error
    }
    process.chdir(cwd);

    if (err)
        throw err
}