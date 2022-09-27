const test = require('test');
test.setup();

const Typify = require('../');

const { requireAsCompilation } = require('./utils');

describe('ts versioned features', () => {
    describe('features 4.1', () => {
        const featureLoader = Typify.generateLoaderbox({
            strict: true
        });

        it("template-literal", () => {
            featureLoader.require('./ts_features/4.1/template-literal', __dirname);
        });

        it("key-remapping", () => {
            featureLoader.require('./ts_features/4.1/key-remapping', __dirname);
        });

        it("recursive-conditional-types", () => {
            featureLoader.require('./ts_features/4.1/recursive-conditional-types.ts', __dirname);
        });

        it("checked-index-access", () => {
            featureLoader.require('./ts_features/4.1/checked-index-access.ts', __dirname);
        });

        it("conditional-spreads-create-optional-properties", () => {
            featureLoader.require('./ts_features/4.1/conditional-spreads-create-optional-properties', __dirname);
        });
    });

    describe('features 4.2', () => {
        const featureLoader = Typify.generateLoaderbox({
            strict: true,
            noEmitOnError: true,
        });

        it("smart-types", () => {
            featureLoader.require('./ts_features/4.2/smart-types', __dirname);
        });

        it("leading-or-middle-rest-elements-in-tuple-types", () => {
            featureLoader.require('./ts_features/4.2/leading-or-middle-rest-elements-in-tuple-types', __dirname);
        });

        it("stricter-checks-for-the-in-operator", () => {
            var emitResult = requireAsCompilation('./ts_features/4.2/stricter-checks-for-the-in-operator.error.ts', {
            });
            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(4,10): The right-hand side of an 'in' expression must not be a primitive."
            ));
        });

        it("abstract-construct-signatures", () => {
            var emitResult = requireAsCompilation('./ts_features/4.2/abstract-construct-signatures.error.ts', {
            });
            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(8,1): Cannot create an instance of an abstract class."
            ));
        });

        it("relaxed-rules-between-optional-properties-and-string-index-signatures", () => {
            var emitResult = requireAsCompilation('./ts_features/4.2/relaxed-rules-between-optional-properties-and-string-index-signatures.error.ts', {
            });
            // TODO: weired, is should emit error, but it not
            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });
    });

    describe('features 4.3', () => {
        const featureLoader = Typify.generateLoaderbox({
            strict: true,
            noEmitOnError: false
        });

        it("Separate-Write-Types-on-Properties", () => {
            featureLoader.require('./ts_features/4.3/Separate-Write-Types-on-Properties.ts', __dirname);
        });

        it("override-and-the-noImplicitOverride-Flag", () => {
            var emitResult = requireAsCompilation('./ts_features/4.3/override-and-the-noImplicitOverride-Flag.error.ts', {
            });
            assert.equal(emitResult.__typifyAllDiagnostics.length, 2);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(5,14): This member cannot have an 'override' modifier because it is not declared in the base class 'SomeComponent'."
            ));
            assert.isTrue((emitResult.__typifyAllDiagnostics[1].error + '').includes(
                "(8,14): This member cannot have an 'override' modifier because it is not declared in the base class 'SomeComponent'."
            ));
        });

        it("Template-String-Type-Improvements", () => {
            featureLoader.require('./ts_features/4.3/Template-String-Type-Improvements', __dirname);
        });

        it("ECMAScript-sharpprivate-Class-Elements", () => {
            // featureLoader.require('./ts_features/4.3/ECMAScript-sharpprivate-Class-Elements', __dirname);

            var emitResult = requireAsCompilation('./ts_features/4.3/ECMAScript-sharpprivate-Class-Elements.error.ts', {
                target: require('typescript').ScriptTarget.ES2015
            });
            assert.equal(emitResult.__typifyAllDiagnostics.length, 3);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(16,11): Property '#someMethod' is not accessible outside class 'Foo' because it has a private identifier."
            ));

            assert.isTrue((emitResult.__typifyAllDiagnostics[1].error + '').includes(
                "(21,11): Property '#someValue' is not accessible outside class 'Foo' because it has a private identifier."
            ));

            assert.isTrue((emitResult.__typifyAllDiagnostics[2].error + '').includes(
                "(33,6): Property '#someMethod' is not accessible outside class 'Foo2' because it has a private identifier."
            ));
        });

        it("ConstructorParameters-Works-on-Abstract-Classes", () => {
            featureLoader.require('./ts_features/4.3/ConstructorParameters-Works-on-Abstract-Classes', __dirname);
        });

        it("Contextual-Narrowing-for-Generics", () => {
            featureLoader.require('./ts_features/4.3/Contextual-Narrowing-for-Generics', __dirname);
        });

        it("Always-Truthy-Promise-Checks", () => {
            featureLoader.require('./ts_features/4.3/Always-Truthy-Promise-Checks', __dirname);
        });

        it("static-Index-Signatures", () => {
            var emitResult = requireAsCompilation('./ts_features/4.3/static-Index-Signatures.ts');
            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            featureLoader.require('./ts_features/4.3/static-Index-Signatures', __dirname);

            var emitResult = requireAsCompilation('./ts_features/4.3/static-Index-Signatures.error.ts');
            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "Property 'prop' of type 'boolean' is not assignable to string index type 'string | number'."
            ));
        });
    });
})

require.main === module && test.run(console.DEBUG)
