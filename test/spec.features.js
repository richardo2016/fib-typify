const test = require('test');
test.setup();

const Typify = require('../');

const { requireAsCompilation, assertDiagnostic } = require('./utils');

describe('ts versioned features', () => {
    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html
     */
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

    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html
     */
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

        describe("stricter-checks-for-the-in-operator", () => {
            it.skip('#4.2', () => {
                var emitResult = requireAsCompilation('./ts_features/4.2/stricter-checks-for-the-in-operator.error.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

                assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                    "(4,10): The right-hand side of an 'in' expression must not be a primitive."
                ));
            });

            // behavior changed in typescript 4.9, see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#unlisted-property-narrowing-with-the-in-operator
            it('#4.9', () => {
                var emitResult = requireAsCompilation('./ts_features/4.2/stricter-checks-for-the-in-operator.error.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                    `Type 'number' is not assignable to type 'object'.`
                ]);
            });
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

    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html
     */
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
                "(2,12): Property 'prop' of type 'boolean' is not assignable to 'string' index type 'string | number'."
            ));
        });
    });

    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html
     */
    describe('features 4.4', () => {
        it('Control-Flow-Analysis-of-Aliased-Conditions-and-Discriminants', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/Control-Flow-Analysis-of-Aliased-Conditions-and-Discriminants.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Symbol-and-Template-String-Pattern-Index-Signatures', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/Symbol-and-Template-String-Pattern-Index-Signatures.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.4/Symbol-and-Template-String-Pattern-Index-Signatures.error.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(8,3): Type 'string' is not assignable to type 'boolean'."
            ));
        });

        it('Defaulting-to-the-unknown-Type-in-Catch-Variables', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/Defaulting-to-the-unknown-Type-in-Catch-Variables.ts', {
                useUnknownInCatchVariables: true
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.4/Defaulting-to-the-unknown-Type-in-Catch-Variables.error.ts', {
                useUnknownInCatchVariables: true
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(11,23): Property 'message' does not exist on type 'unknown'."
            ));
        });

        it('Exact-Optional-Property-Types', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/Exact-Optional-Property-Types.error.ts', {
                exactOptionalPropertyTypes: false
            });
            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.4/Exact-Optional-Property-Types.error.ts', {
                strictNullChecks: true,
                exactOptionalPropertyTypes: true
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(`(8,7): Type '{ name: string; age: undefined; }' is not assignable to type 'Person' with 'exactOptionalPropertyTypes: true'. Consider adding 'undefined' to the types of the target's properties.`));
            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(`Types of property 'age' are incompatible.`));
            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(`Type 'undefined' is not assignable to type 'number'.`));
        });

        it('static-Blocks-in-Classes', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/static-Blocks-in-Classes.ts', {
                target: 'es2015'
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Broader-Always-Truthy-Promise-Checks', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/Broader-Always-Truthy-Promise-Checks.ts', {
                strictNullChecks: false,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.4/Broader-Always-Truthy-Promise-Checks.ts', {
                strictNullChecks: true,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(8,9): This condition will always return true since this 'Promise<boolean>' is always defined."
            ));
        });

        it('Abstract-Properties-Do-Not-Allow-Initializers', () => {
            var emitResult = requireAsCompilation('./ts_features/4.4/Abstract-Properties-Do-Not-Allow-Initializers.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(6,14): Property 'prop' cannot have an initializer because it is marked abstract."
            ));
        });
    });

    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html
     */
    describe('features 4.5', () => {
        it('The-Awaited-Type-and-Promise-Improvements', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/The-Awaited-Type-and-Promise-Improvements.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Template-String-Types-as-Discriminants', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/Template-String-Types-as-Discriminants.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Tail-Recursion-Elimination-on-Conditional-Types', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/Tail-Recursion-Elimination-on-Conditional-Types.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.5/Tail-Recursion-Elimination-on-Conditional-Types.error.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(4,13): Type instantiation is excessively deep and possibly infinite."
            ));

        });

        it('Disabling-Import-Elision', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/Disabling-Import-Elision.ts', {
                module: require('typescript').ModuleKind.ES2015,
                isolatedModules: false,
                preserveValueImports: true
            });
            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.5/Disabling-Import-Elision.ts', {
                module: require('typescript').ModuleKind.ES2015,
                isolatedModules: true,
                preserveValueImports: true
            });

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(1,15): 'Animal' is a type and must be imported using a type-only import when 'preserveValueImports' and 'isolatedModules' are both enabled."
            ));

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);
        });

        it('type-Modifiers-on-Import-Names', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/type-Modifiers-on-Import-Names.ts', {
                module: require('typescript').ModuleKind.ES2015,
                isolatedModules: true,
                preserveValueImports: true
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Private-Field-Presence-Checks', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/Private-Field-Presence-Checks.ts', {
                target: require('typescript').ScriptTarget.ES2015,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Import-Assertions', () => {
            var emitResult = requireAsCompilation('./ts_features/4.5/Import-Assertions.ts', {
                resolveJsonModule: true,
                module: require('typescript').ModuleKind.ESNext,
                moduleResolution: require('typescript').ModuleResolutionKind.NodeJs,
                esModuleInterop: true,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

    });

    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-6.html
     */
    describe('features 4.6', () => {
        it('Allowing-Code-in-Constructors-Before-super', () => {
            var emitResult = requireAsCompilation('./ts_features/4.6/Allowing-Code-in-Constructors-Before-super.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        })

        it('Control-Flow-Analysis-for-Destructured-Discriminated-Unions', () => {
            var emitResult = requireAsCompilation('./ts_features/4.6/Control-Flow-Analysis-for-Destructured-Discriminated-Unions.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        })

        it('Improved-Recursion-Depth-Checks', () => {
            var emitResult = requireAsCompilation('./ts_features/4.6/Improved-Recursion-Depth-Checks.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                "(6,1): Type 'Foo<Foo<Foo<Foo<Foo<string>>>>>' is not assignable to type 'Foo<Foo<Foo<Foo<Foo<Foo<string>>>>>>'."
            ));
        })

        it('Indexed-Access-Inference-Improvements', () => {
            var emitResult = requireAsCompilation('./ts_features/4.6/Indexed-Access-Inference-Improvements.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        })

        it('Control-Flow-Analysis-for-Dependent-Parameters', () => {
            var emitResult = requireAsCompilation('./ts_features/4.6/Control-Flow-Analysis-for-Dependent-Parameters.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        })

        it('Object-Rests-Drop-Unspreadable-Members-from-Generic-Objects', () => {
            var emitResult = requireAsCompilation('./ts_features/4.6/Object-Rests-Drop-Unspreadable-Members-from-Generic-Objects.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 2);

            assert.isTrue((emitResult.__typifyAllDiagnostics[0].error + '').includes(
                `(11,10): Property 'someMethod' does not exist on type 'Omit<T, "someProperty" | "someMethod">'.`
            ));

            assert.isTrue((emitResult.__typifyAllDiagnostics[1].error + '').includes(
                `(23,14): Property 'someMethod2' does not exist on type 'Omit<this, "someProperty" | "someMethod2" | "someOtherMethod">'.`
            ));
        })
    });

    /**
     * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html
     */
    describe('features 4.7', () => {
        // see more details in https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#new-file-extensions
        it('CommonJS-Interoperability', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/CommonJS-Interoperability/foo.cts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Control-Flow-Analysis-for-Bracketed-Element-Access', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/Control-Flow-Analysis-for-Bracketed-Element-Access/sample1.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.7/Control-Flow-Analysis-for-Bracketed-Element-Access/strictPropertyInitialization.ts', {
                strictNullChecks: true,
                strictPropertyInitialization: true
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);
            assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                `Property '[key]' has no initializer and is not definitely assigned in the constructor.`,
            ]);
        });

        // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#control-over-module-detection
        it('Control-over-Module-Detection', () => {
            var emitResult = requireAsCompilation('./ts_features/empty.ts', {
                moduleDetection: require('typescript').ModuleDetectionKind.Auto,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('ECMAScript-Module-Support-in-Node.js', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/ECMAScript-Module-Support-in-Node.js.ts', {
                module: require('typescript').ModuleKind.Node16,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('extends-Constraints-on-infer-Type-Variables', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/extends-Constraints-on-infer-Type-Variables/previous1.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.7/extends-Constraints-on-infer-Type-Variables/previous2.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.7/extends-Constraints-on-infer-Type-Variables/now.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#go-to-source-definition
        it('Go-to-Source-Definition', () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#group-aware-organize-imports
        it('Group-Aware-Organize-Imports', () => {
        });

        it('Improved-Function-Inference-in-Objects-and-Methods', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/Improved-Function-Inference-in-Objects-and-Methods/work.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Instantiation-Expressions', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/Instantiation-Expressions.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#object-method-snippet-completions
        it('Object-Method-Snippet-Completions', () => {
        });

        describe('Optional-Variance-Annotations-for-Type-Parameters', () => {
            it('previous', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Optional-Variance-Annotations-for-Type-Parameters/previous.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('now-explicit-in-out', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Optional-Variance-Annotations-for-Type-Parameters/now-explicit-in-out.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('now-both-in-out', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Optional-Variance-Annotations-for-Type-Parameters/now-both-in-out.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('now-out-error1', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Optional-Variance-Annotations-for-Type-Parameters/now-out-error1.ts');

                // note there's no error emitted, but in fact there should be, just see red underlines in the file.
                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('type-check-previous', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Optional-Variance-Annotations-for-Type-Parameters/type-check-previous.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

                var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
                assertDiagnostic(diagnostic, [
                    `Type 'Foo<unknown>' is not assignable to type 'Foo<string>'.`,
                    `Type 'unknown' is not assignable to type 'string'.`,
                ]);
            });

            it('type-check-now', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Optional-Variance-Annotations-for-Type-Parameters/type-check-now.ts');
                assert.equal(emitResult.__typifyAllDiagnostics.length, 2);

                var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
                assertDiagnostic(diagnostic, [
                    `Type 'Foo<string>' is not assignable to type 'Foo<unknown>'.`,
                    `Types of property 'f' are incompatible.`,
                    `Type 'Bar<string>' is not assignable to type 'Bar<unknown>'.`,
                    `Types of parameters 'x' and 'x' are incompatible.`,
                    `Type 'Baz<unknown[]>' is not assignable to type 'Baz<string[]>'.`,
                    `The types of 'value.x' are incompatible between these types.`,
                    `Type 'unknown[][]' is not assignable to type 'string[][]'.`,
                ]);
            });
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#packagejson-exports-imports-and-self-referencing
        it('package-json-Exports-Imports-and-Self-Referencing', () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#readfile-method-is-no-longer-optional-on-languageservicehost
        it('readFile-Method-is-No-Longer-Optional-on-LanguageServiceHost', () => {
        });

        it('Resolution-Customization-with-moduleSuffixes', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/Resolution-Customization-with-moduleSuffixes/index.ts', {
                moduleSuffixes: ['.ios', ''],
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 00);0

            var emitResult = requireAsCompilation('./ts_features/4.7/Resolution-Customization-with-moduleSuffixes/index.ts', {
                moduleSuffixes: ['.native', ''],
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        /**
         * Additionally, in nightly versions of TypeScript, import type can specify an import assertion to achieve something similar.
         *
         * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#resolution-mode
         */
        it('resolution-mode', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/resolution-mode/import', {
                moduleResolution: require('typescript').ModuleResolutionKind.NodeNext,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.7/resolution-mode/require', {
                moduleResolution: require('typescript').ModuleResolutionKind.NodeNext,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        describe('Stricter-Checks-with-Template-String-Expressions', () => {
            it('symbol', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Stricter-Checks-with-Template-String-Expressions/symbol.ts');

                assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

                var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
                assertDiagnostic(diagnostic, [
                    `Implicit conversion of a 'symbol' to a 'string' will fail at runtime. Consider wrapping this expression in 'String(...)'.`
                ]);
            });

            it('symbol-as-generics', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Stricter-Checks-with-Template-String-Expressions/symbol-as-generics.ts');

                assert.equal(emitResult.__typifyAllDiagnostics.length, 2);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                    `Implicit conversion of a 'symbol' to a 'string' will fail at runtime. Consider wrapping this expression in 'String(...)'.`,
                ]);
                assertDiagnostic(emitResult.__typifyAllDiagnostics[1].diagnostic, [
                    `Implicit conversion of a 'symbol' to a 'string' will fail at runtime. Consider wrapping this expression in 'String(...)'.`,
                ]);
            });

            it('workaround', () => {
                var emitResult = requireAsCompilation('./ts_features/4.7/Stricter-Checks-with-Template-String-Expressions/workaround.ts');

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });
        });

        it('Stricter-Spread-Checks-in-JSX', () => {
            var emitResult = requireAsCompilation('./ts_features/4.7/Stricter-Spread-Checks-in-JSX/index.tsx', {
                jsx: true,
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
            assertDiagnostic(diagnostic, [
                'Spread types may only be created from object types.'
            ]);
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#type-in-packagejson-and-new-extensions
        it('type-in-package-json-and-New-Extensions', () => {
        });
    });

    describe('features 4.8', () => {
        describe('Improved-Intersection-Reduction--Union-Compatibility--and-Narrowing', () => {
            it('unknown-assign-to-null-undefined-plainobj', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Intersection-Reduction--Union-Compatibility--and-Narrowing/unknown-assign-to-null-undefined-plainobj', {
                    strictNullChecks: true,
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('simpler-nonnullable-impl', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Intersection-Reduction--Union-Compatibility--and-Narrowing/simpler-nonnullable-impl', {
                    strictNullChecks: true,
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('control-flow', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Intersection-Reduction--Union-Compatibility--and-Narrowing/control-flow', {
                    strictNullChecks: true,
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('generics', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Intersection-Reduction--Union-Compatibility--and-Narrowing/generics', {
                    strictNullChecks: true,
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });
        });

        it('Improved-Inference-for-infer-Types-in-Template-String-Types', () => {
            var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Inference-for-infer-Types-in-Template-String-Types/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Inference-for-infer-Types-in-Template-String-Types/back-matches.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it('Errors-When-Comparing-Object-and-Array-Literals', () => {
            var emitResult = requireAsCompilation('./ts_features/4.8/Errors-When-Comparing-Object-and-Array-Literals/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
            assertDiagnostic(diagnostic, [
                `This condition will always return 'false' since JavaScript compares objects by reference, not value.`,
            ]);
        });

        it('Improved-Inference-from-Binding-Patterns', () => {
            var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Inference-from-Binding-Patterns/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);

            var emitResult = requireAsCompilation('./ts_features/4.8/Improved-Inference-from-Binding-Patterns/cannot-parse.ts');
            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
            assertDiagnostic(diagnostic, [
                `Type 'unknown' is not an array type.`,
            ]);
        });

        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#file-watching-fixes-especially-across-git-checkouts
        it('File-Watching-Fixes-Especially-Across-git-checkouts', () => {
        });

        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#find-all-references-performance-improvements
        it('Find-All-References-Performance-Improvements', () => {
        });

        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#exclude-specific-files-from-auto-imports
        it('Exclude-Specific-Files-from-Auto-Imports', () => {
        });

        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#correctness-fixes-and-breaking-changes
        it('Correctness-Fixes-and-Breaking-Changes', () => {
        });

        describe('Unconstrained-Generics-No-Longer-Assignable-to', () => {
            it('value', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Unconstrained-Generics-No-Longer-Assignable-to/value.ts', {
                    strictNullChecks: true
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 1);
                var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
                assertDiagnostic(diagnostic, [
                    `Argument of type 'T' is not assignable to parameter of type '{}'.`,
                ]);
            });

            it('value-correct', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Unconstrained-Generics-No-Longer-Assignable-to/value-correct.ts', {
                    strictNullChecks: true
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('value-workaround-by-controlflow', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Unconstrained-Generics-No-Longer-Assignable-to/value-workaround-by-controlflow.ts', {
                    strictNullChecks: true
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('value-workaround-due-to-improved-intersection', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Unconstrained-Generics-No-Longer-Assignable-to/value-workaround-due-to-improved-intersection.ts', {
                    strictNullChecks: true
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
            });

            it('type', () => {
                var emitResult = requireAsCompilation('./ts_features/4.8/Unconstrained-Generics-No-Longer-Assignable-to/type.ts', {
                    strictNullChecks: true
                });

                assert.equal(emitResult.__typifyAllDiagnostics.length, 1);
                var diagnostic = emitResult.__typifyAllDiagnostics[0].diagnostic;
                assertDiagnostic(diagnostic, [
                    `Type 'T' does not satisfy the constraint '{}'.`,
                ]);
            });
        });

        // see more details in https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#decorators-are-placed-on-modifiers-on-typescripts-syntax-trees
        it('Decorators-are-placed-on-modifiers-on-TypeScript-s-Syntax-Trees', () => {
            var emitResult = requireAsCompilation('./ts_features/4.8/Decorators-are-placed-on-modifiers-on-TypeScript-s-Syntax-Trees/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#decorators-are-placed-on-modifiers-on-typescripts-syntax-trees
        it('Types-Cannot-Be-Imported/Exported-in-JavaScript-Files', () => {
            // open file test/ts_features/4.8/Types-Cannot-Be-Imported-Exported-in-JavaScript-Files/index.js
            // then see the errors in IDE
        });

        // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-8.html#binding-patterns-do-not-directly-contribute-to-inference-candidates
        it('Binding-Patterns-Do-Not-Directly-Contribute-to-Inference-Candidates', () => {
        });

        it('Unused-Renames-in-Binding-Patterns-are-Now-Errors-in-Type-Signatures', () => {
            var emitResult = requireAsCompilation('./ts_features/4.8/Unused-Renames-in-Binding-Patterns-are-Now-Errors-in-Type-Signatures/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 2);
            assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                `'string' is an unused renaming of 'name'. Did you intend to use it as a type annotation?`,
            ]);
            assertDiagnostic(emitResult.__typifyAllDiagnostics[1].diagnostic, [
                `'number' is an unused renaming of 'age'. Did you intend to use it as a type annotation?`,
            ]);
        });
    });

    describe('features 4.9', () => {
        describe("The-satisfies-Operator", () => {
            it("basic", () => {
                var emitResult = requireAsCompilation('./ts_features/4.9/The-satisfies-Operator/index.ts');

                assert.equal(emitResult.__typifyAllDiagnostics.length, 2);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                    `Type '{ red: [number, number, number]; green: string; bleu: number[]; }' does not satisfy the expected type 'Record<Colors, string | RGB>'.`,
                    `Object literal may only specify known properties, and 'bleu' does not exist in type 'Record<Colors, string | RGB>'.`,
                ]);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[1].diagnostic, [
                    `Property 'at' does not exist on type '[number, number, number]'.`,
                ]);
            });

            it("catch errors", () => {
                var emitResult = requireAsCompilation('./ts_features/4.9/The-satisfies-Operator/catch-errors.ts');

                assert.equal(emitResult.__typifyAllDiagnostics.length, 3);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                    `Type '{ red: string; green: boolean; blue: string; platypus: boolean; }' does not satisfy the expected type 'Record<Colors, unknown>'.`,
                    `Object literal may only specify known properties, and '"platypus"' does not exist in type 'Record<Colors, unknown>'.`,
                ]);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[1].diagnostic, [
                    `Type '[number, number]' is not assignable to type 'string | RGB'.`,
                    `Type '[number, number]' is not assignable to type 'string'.`
                ]);

                assertDiagnostic(emitResult.__typifyAllDiagnostics[2].diagnostic, [
                    `Property 'at' does not exist on type '[number, number, number]'.`
                ]);
            });
        });

        it("Unlisted-Property-Narrowing-with-the-in-Operator", () => {
            var emitResult = requireAsCompilation('./ts_features/4.9/Unlisted-Property-Narrowing-with-the-in-Operator/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        // see https://github.com/tc39/proposal-decorators
        it("Auto-Accessors-in-Classes", () => {
            var emitResult = requireAsCompilation('./ts_features/4.9/Auto-Accessors-in-Classes/index.ts', {
                target: 'es2015'
            });

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        it("Checks-For-Equality-on-NaN", () => {
            var emitResult = requireAsCompilation('./ts_features/4.9/Checks-For-Equality-on-NaN/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 1);

            assertDiagnostic(emitResult.__typifyAllDiagnostics[0].diagnostic, [
                `This condition will always return 'true'.`
            ]);
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#file-watching-now-uses-file-system-events
        // ? maybe this not affected fibjs's impl?
        it.skip("File-Watching-Now-Uses-File-System-Events", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#remove-unused-imports-and-sort-imports-commands-for-editors
        it.skip("Remove-Unused-Imports-and-Sort-Imports-Commands-for-Editors", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#go-to-definition-on-return-keywords
        it.skip("Go-to-Definition-on-return-Keywords", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#performance-improvements
        it.skip("Performance-Improvements", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#libdts-updates
        it.skip("lib.d.ts-Updates", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#better-types-for-promiseresolve
        it.skip("Better-Types-for-Promise.resolve", () => {
            var emitResult = requireAsCompilation('./ts_features/4.9/Better-Types-for-Promise.resolve/index.ts');

            assert.equal(emitResult.__typifyAllDiagnostics.length, 0);
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#javascript-emit-no-longer-elides-imports
        it.skip("JavaScript-Emit-No-Longer-Elides-Imports", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#exports-is-prioritized-over-typesversions
        it.skip("exports-is-Prioritized-Over-typesVersions", () => {
        });

        // @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#substitute-replaced-with-constraint-on-substitutiontypes
        it.skip("substitute-Replaced-With-constraint-on-SubstitutionTypes", () => {
        });
    });
})

require.main === module && test.run(console.DEBUG)
