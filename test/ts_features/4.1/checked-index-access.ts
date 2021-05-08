interface _Options {
    path: string;
    permissions: number;

    // Extra properties are caught by this index signature.
    [propName: string]: string | number;
}

function checkOptions(opts: _Options) {
    opts.path; // string
    opts.permissions; // number

    // These are all allowed too!
    // They have the type 'string | number'.
    opts.yadda.toString();
    opts["foo bar baz"].toString();
    opts[Math.random()].toString();
}
