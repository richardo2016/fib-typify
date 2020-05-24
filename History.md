
v0.8.2 / 2020-05-25
==================



v0.8.1 / 2020-05-25
===================

  * Release v0.8.1
  * feat: support more ts build options to ftsc, add test basic sample for ftsc.
  * chore: update doc.

v0.8.0 / 2020-05-24
===================

  * Release v0.8.0
  * feat: replace program API in registerTsCompiler
  * feat: use customized ts program (#14)

v0.7.0 / 2019-09-07
===================

  * Release v0.7.0
  * support compile .tsx to .js
  * upgrade ci config.
  * upgrade dependencies; deprecate old api.

v0.6.0 / 2019-06-03
===================

  * Release v0.6.0
  * upgrade dependency
  * keep shebang
  * replace @types/fibjs with @fibjs/types.
  * use @fxjs/cli as cli maker.

v0.5.2 / 2019-01-18
===================

  * Release v0.5.2
  * typo fix.

v0.5.1 / 2019-01-12
===================

  * Release v0.5.1
  * fix implement of `resolveExistedEntry`.
  * test case fix.
  * normalize README.md
  * normalize args.
  * move general from `fibTypify` to `Typify`.
  * support auto fallback to `compileFileTo` in `compileDirectoryTo`.
  * fix test case for fibjs <= 0.26.x, where isSupportSetModuleCompiler() === false
  * robust for source-map.
  * fix grandmother-paradox style generating.
  * robust for `compileDirectoryTo`.
  * support use typescript script as entry point.
  * normalize cli script.
  * add 'types' to package.json.
  * publish.

v0.5.0 / 2018-12-28
===================

  * Release v0.5.0
  * adjust for publish.
  * doc normalization.
  * add new feature to doc, fix typo.
  * add test case about using shared Error constructor with`coroutine.start`.
  * adjust directory, add test cases about sourceMap.
  * code format.
  * add some test cases(with TODO record).
  * support emit correct stack lineNumber/columNumber when error occured in typescript.

v0.4.1 / 2018-11-25
===================

  * Release v0.4.1
  * add appveyor ci badget.
  * add appveyor ci config.
  * abstract utils overwriteFile
  * fix overwriting failure when executing '_getCopyWhiteListViaGlobrule'.
  * [README.md] add marked sample before `introduction`.

v0.4.0 / 2018-11-03
===================

  * Release v0.4.0
  * update README.md
  * support read compilerOptions from 'tsconfig.json', and depreacte two useless util functions.

v0.3.1 / 2018-10-02
===================

  * Release v0.3.1
  * fix mistake about fibjs@0.21.0 of builtin-modules
  * upgrade '@types/fibjs'
  * [README.md] update

v0.3.0 / 2018-08-21
===================

  * Release v0.3.0
  * [README] add content about loaderBox.
  * [@fibjs/ci:config] remove 0.21.0, add 0.26.1
  * support loader for fibjs with version between 0.21.0, 0.26.0

v0.2.1 / 2018-08-17
===================

  * Release v0.2.1
  * add 'moduleName' option to sboxOpts.
  * rename 'compileRawToSandbox' to 'compileRawToSandBox', and do other name normalization.
  * fix and update README.md.

v0.2.0 / 2018-06-18
===================

  * 0.2.0
  * fix implement of  cli option '-c', update README.md

v0.1.3 / 2018-06-17
===================

  * 0.1.3
  * fix test case, then update ci config.
  * support bin 'fib-typify'.
  * Merge pull request #2 from richardo2016/dev

v0.1.2 / 2018-06-10
===================

  * 0.1.2
  * support new option in `compileDirToOpts`.
  * v0.1.1
  * correct APIs in README.md
  * add travis ci and npm version badget.
  * add '@fibjs/ci' to support ci.
  * v0.1.0
  * support providing 'compilerOptions' when calling 'compileDirectoryTo'.
  * update README.md
  * init.
  * Initial commit
