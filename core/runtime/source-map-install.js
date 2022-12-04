const fs = require('fs')
const coroutine = require('coroutine')

const getCacheSourceMap = function (filename) {
    return fs.readFile(`${filename}.zip$/index.map`, 'utf-8')
}

const sourceMapSupport = require('source-map-support');
sourceMapSupport.install({
    environment: 'node',
    retrieveFile (filename) {
        if (!fs.exists(filename))
            return null

        if (filename.lastIndexOf('.ts') < 0)
            return null

        try {
            return getCacheSourceMap(filename)
        } catch (e) {
            console.warn(`[retrieveFile] retrieve sourcemap for ${filename} failed, view error detail to help.`)
            console.error(e.stack)
        }
    }
})

global.Error = Error

var orig = Error.prepareStackTrace;
Error.prepareStackTrace1 = function (_, stack) {
    // console.notice('[feat] Error.prepareStackTrace:: stack', stack);
    stack.forEach((item) => {
        const filename = item.getFileName();
        const sM = getCacheSourceMap(filename);
        // console.notice('[feat] Error.prepareStackTrace:: sM', sM);

        const fiber = coroutine.current();

        console.notice('[feat] Error.prepareStackTrace:: fiber', fiber);

        console.notice('[feat] Error.prepareStackTrace:: item.getThis', item.getThis());
        console.notice('[feat] Error.prepareStackTrace:: item.getTypeName', item.getTypeName());
        console.notice('[feat] Error.prepareStackTrace:: item.getFunction', item.getFunction());
        console.notice('[feat] Error.prepareStackTrace:: item.getFunctionName', item.getFunctionName());
        console.notice('[feat] Error.prepareStackTrace:: item.getMethodName', item.getMethodName());
        console.notice('[feat] Error.prepareStackTrace:: item.getFileName', item.getFileName());
        console.notice('[feat] Error.prepareStackTrace:: item.getLineNumber', item.getLineNumber());
        console.notice('[feat] Error.prepareStackTrace:: item.getColumnNumber', item.getColumnNumber());
        console.notice('[feat] Error.prepareStackTrace:: item.getEvalOrigin', item.getEvalOrigin());
        console.notice('[feat] Error.prepareStackTrace:: item.isToplevel', item.isToplevel());
        console.notice('[feat] Error.prepareStackTrace:: item.isEval', item.isEval());
        console.notice('[feat] Error.prepareStackTrace:: item.isNative', item.isNative());
        console.notice('[feat] Error.prepareStackTrace:: item.isConstructor', item.isConstructor());
    });

    // return stack;
    return orig.apply(this, arguments);
};
