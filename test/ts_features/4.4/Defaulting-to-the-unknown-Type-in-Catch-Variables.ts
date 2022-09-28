// require flag: --useUnknownInCatchVariables

function executeSomeThirdPartyCode() { };

// if no flags are passed, the catch variable is of type any
// try {
//     // Who knows what this might throw...
//     executeSomeThirdPartyCode();
// } catch (err) {
//     // err: any
//     console.error(err.message); // Allowed, because 'any'
//     err.thisWillProbablyFail(); // Allowed, because 'any' :(
// }

try {
    executeSomeThirdPartyCode();
} catch (err) {
    // err: unknown

    // Works! We can narrow 'err' from 'unknown' to 'Error'.
    if (err instanceof Error) {
        console.error(err.message);
    }
}

// In cases where we don’t want to deal with an unknown variable in a catch clause, we can always add an explicit : any annotation so that we can opt out of stricter types.
try {
    executeSomeThirdPartyCode();
} catch (err: any) {
    console.error(err.message); // Works again!
}
