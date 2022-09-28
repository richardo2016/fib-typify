// require flag: --useUnknownInCatchVariables

function executeSomeThirdPartyCode() { };

try {
    executeSomeThirdPartyCode();
} catch (err) {
    // err: unknown

    // Error! Property 'message' does not exist on type 'unknown'.
    console.error(err.message);
    //   Object is of type 'unknown'.
}
