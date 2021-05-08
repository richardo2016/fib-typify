exports.runProcess = function (cmd, args = [], opts) {
    if (!process.run) {
		const child_process = require('child_process')

        return child_process.run(
			cmd,
			args,
            opts
		);
    }

    return process.run(cmd, args, opts);
}

exports.openProcess = function (cmd, args = [], opts) {
	if (!process.open) {
		const child_process = require('child_process')
		const io = require('io')

		const bs = child_process.spawn(
			cmd,
			args,
            opts
		);

		var stdout = new io.BufferedStream(bs.stdout);
		var stderr = new io.BufferedStream(bs.stderr);

		return {
            stdout,
            stderr,
        }
	}

	const sp = process.open(cmd, args, opts);
	sp.wait();

	return {
        stdout: sp.stdout,
        stderr: sp.stderr
    };
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
